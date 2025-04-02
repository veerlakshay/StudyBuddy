// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { auth, db } from "../config/firebase";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { isGroupExpired } from "../utils/groupCleanup";

const HomeScreen = ({ navigation }) => {
    const [userStats, setUserStats] = useState({
        joinedGroups: 0,
        createdGroups: 0,
        activeGroups: 0
    });
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const userId = auth.currentUser.uid;
        const userEmail = auth.currentUser.email;
        setUserEmail(userEmail);

        // Fetch user data
        const userRef = doc(db, "users", userId);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUsername(doc.data().username);
            }
        });

        // Fetch user's joined groups
        const joinedGroupsRef = collection(db, "users", userId, "joinedGroups");
        const joinedGroupsUnsubscribe = onSnapshot(joinedGroupsRef, (snapshot) => {
            const joinedGroups = snapshot.docs.map(doc => doc.data());
            const activeGroups = joinedGroups.filter(group => !isGroupExpired(group.dateTimestamp));
            setUserStats(prev => ({
                ...prev,
                joinedGroups: joinedGroups.length,
                activeGroups: activeGroups.length
            }));
        });

        // Fetch user's created groups
        const createdGroupsRef = collection(db, "studyGroups");
        const createdGroupsQuery = query(createdGroupsRef, where("createdBy", "==", userEmail));
        const createdGroupsUnsubscribe = onSnapshot(createdGroupsQuery, (snapshot) => {
            setUserStats(prev => ({
                ...prev,
                createdGroups: snapshot.docs.length
            }));
            setLoading(false);
        });

        return () => {
            unsubscribeUser();
            joinedGroupsUnsubscribe();
            createdGroupsUnsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.replace("Login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading your dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>StudyBuddy</Text>
                        <TouchableOpacity 
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content}>
                <View style={styles.welcomeSection}>
                    <View style={styles.welcomeContent}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.userName}>{username || userEmail}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={[styles.statCard, { backgroundColor: colors.primaryLight + '10' }]}>
                            <Ionicons name="people-outline" size={24} color={colors.primary} />
                            <Text style={[styles.statNumber, { color: colors.primary }]}>{userStats.activeGroups}</Text>
                            <Text style={styles.statLabel}>Active Groups</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: colors.secondaryLight + '10' }]}>
                            <Ionicons name="add-circle-outline" size={24} color={colors.secondary} />
                            <Text style={[styles.statNumber, { color: colors.secondary }]}>{userStats.createdGroups}</Text>
                            <Text style={styles.statLabel}>Created</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: colors.accentLight + '10' }]}>
                            <Ionicons name="star-outline" size={24} color={colors.accent} />
                            <Text style={[styles.statNumber, { color: colors.accent }]}>{userStats.joinedGroups}</Text>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.appInfoSection}>
                    <View style={styles.appInfoCard}>
                        <View style={styles.appInfoHeader}>
                            <Ionicons name="bulb-outline" size={24} color={colors.primary} />
                            <Text style={styles.appInfoTitle}>Study Together, Learn Better</Text>
                        </View>
                        <Text style={styles.appInfoText}>
                            StudyBuddy connects students to create collaborative study groups. Find study partners, share knowledge, and achieve your academic goals together.
                        </Text>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primaryLight + '10' }]}
                            onPress={() => navigation.navigate("PostGroup")}
                        >
                            <View style={styles.buttonContent}>
                                <View style={[styles.buttonIconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
                                    <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
                                </View>
                                <View style={styles.buttonTextContainer}>
                                    <Text style={[styles.buttonTitle, { color: colors.primary }]}>Create Study Group</Text>
                                    <Text style={styles.buttonSubtitle}>Start a new study session</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.secondaryLight + '10' }]}
                            onPress={() => navigation.navigate("GroupsList")}
                        >
                            <View style={styles.buttonContent}>
                                <View style={[styles.buttonIconContainer, { backgroundColor: colors.secondaryLight + '20' }]}>
                                    <Ionicons name="people-outline" size={32} color={colors.secondary} />
                                </View>
                                <View style={styles.buttonTextContainer}>
                                    <Text style={[styles.buttonTitle, { color: colors.secondary }]}>All Study Groups</Text>
                                    <Text style={styles.buttonSubtitle}>Browse available groups</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.accentLight + '10' }]}
                            onPress={() => navigation.navigate("Profile")}
                        >
                            <View style={styles.buttonContent}>
                                <View style={[styles.buttonIconContainer, { backgroundColor: colors.accentLight + '20' }]}>
                                    <Ionicons name="person-outline" size={32} color={colors.accent} />
                                </View>
                                <View style={styles.buttonTextContainer}>
                                    <Text style={[styles.buttonTitle, { color: colors.accent }]}>My Groups</Text>
                                    <Text style={styles.buttonSubtitle}>View your joined groups</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tipsSection}>
                    <Text style={styles.sectionTitle}>Study Tips</Text>
                    <View style={styles.tipsContainer}>
                        <View style={styles.tipCard}>
                            <Ionicons name="time-outline" size={24} color={colors.primary} />
                            <Text style={styles.tipText}>Schedule regular study sessions</Text>
                        </View>
                        <View style={styles.tipCard}>
                            <Ionicons name="people-outline" size={24} color={colors.primary} />
                            <Text style={styles.tipText}>Study with peers for better understanding</Text>
                        </View>
                        <View style={styles.tipCard}>
                            <Ionicons name="book-outline" size={24} color={colors.primary} />
                            <Text style={styles.tipText}>Take breaks between sessions</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.muted,
    },
    header: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingTop: 20,
    },
    headerContent: {
        padding: 20,
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
    },
    logoutButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    content: {
        flex: 1,
    },
    welcomeSection: {
        padding: 20,
    },
    welcomeContent: {
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 16,
        color: colors.muted,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: "600",
        color: colors.text,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "700",
        marginVertical: 8,
    },
    statLabel: {
        fontSize: 12,
        color: colors.muted,
    },
    appInfoSection: {
        padding: 20,
    },
    appInfoCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
    appInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    appInfoTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
        marginLeft: 8,
    },
    appInfoText: {
        fontSize: 14,
        color: colors.muted,
        lineHeight: 20,
    },
    actionsSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 16,
    },
    buttonContainer: {
        gap: 16,
    },
    button: {
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    buttonTextContainer: {
        flex: 1,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    buttonSubtitle: {
        fontSize: 14,
        color: colors.muted,
    },
    tipsSection: {
        padding: 20,
    },
    tipsContainer: {
        gap: 12,
    },
    tipCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tipText: {
        fontSize: 14,
        color: colors.text,
        marginLeft: 12,
        flex: 1,
    },
});

export default HomeScreen;
