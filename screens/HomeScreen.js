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
import { collection, query, where, onSnapshot } from "firebase/firestore";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { isGroupExpired } from "../utils/groupCleanup";

const HomeScreen = ({ navigation }) => {
    const [userStats, setUserStats] = useState({
        joinedGroups: 0,
        createdGroups: 0,
        activeGroups: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = auth.currentUser.uid;
        const userEmail = auth.currentUser.email;

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
            joinedGroupsUnsubscribe();
            createdGroupsUnsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.replace("Login");
        } catch (error) {
            alert("Error logging out: " + error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>StudyBuddy</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.welcomeSection}>
                    <View style={styles.welcomeContent}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.userName}>{auth.currentUser.email}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Ionicons name="people-outline" size={24} color={colors.primary} />
                            <Text style={styles.statNumber}>{userStats.activeGroups}</Text>
                            <Text style={styles.statLabel}>Active Groups</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                            <Text style={styles.statNumber}>{userStats.createdGroups}</Text>
                            <Text style={styles.statLabel}>Created</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="star-outline" size={24} color={colors.primary} />
                            <Text style={styles.statNumber}>{userStats.joinedGroups}</Text>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={() => navigation.navigate("PostGroup")}
                        >
                            <View style={styles.actionButtonContent}>
                                <Ionicons name="add-circle" size={32} color="#fff" />
                                <Text style={styles.actionButtonText}>Create Study Group</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryButton]}
                            onPress={() => navigation.navigate("GroupsList")}
                        >
                            <View style={styles.actionButtonContent}>
                                <Ionicons name="search" size={32} color={colors.primary} />
                                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                                    Find Study Groups
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryButton]}
                            onPress={() => navigation.navigate("Profile")}
                        >
                            <View style={styles.actionButtonContent}>
                                <Ionicons name="person" size={32} color={colors.primary} />
                                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                                    My Profile
                                </Text>
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
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        backgroundColor: colors.card,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
    },
    logoutButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: colors.card,
        marginBottom: 20,
    },
    welcomeContent: {
        marginBottom: 20,
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
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 4,
        alignItems: "center",
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
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
    actionButtons: {
        gap: 12,
    },
    actionButton: {
        borderRadius: 16,
        padding: 16,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 12,
    },
    secondaryButtonText: {
        color: colors.text,
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
