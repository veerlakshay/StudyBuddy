// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { auth, db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import colors from "../theme/colors";
import { isGroupExpired } from "../utils/groupCleanup";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const userId = auth.currentUser?.uid;

    const fetchJoinedGroups = () => {
        const joinedRef = collection(db, "users", userId, "joinedGroups");

        const unsubscribe = onSnapshot(joinedRef, (snapshot) => {
            const groups = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(group => !isGroupExpired(group.dateTimestamp));
            setJoinedGroups(groups);
            setLoading(false);
            setRefreshing(false);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchJoinedGroups();
        return () => unsubscribe();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchJoinedGroups();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace("Login");
        } catch (error) {
            alert("Error logging out: " + error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                    <Ionicons name="school-outline" size={24} color={colors.primary} />
                    <Text style={styles.title}>{item.title}</Text>
                </View>
            </View>

            <View style={styles.subjectContainer}>
                <Ionicons name="book-outline" size={16} color={colors.muted} />
                <Text style={styles.subject}>{item.subject}</Text>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.footer}>
                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color={colors.muted} />
                    <Text style={styles.date}>{item.dateString}</Text>
                </View>
                <Text style={styles.creator}>Posted by {item.createdBy}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color={colors.danger} />
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
                </View>
                <Text style={styles.email}>{auth.currentUser?.email}</Text>
            </View>

            <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>My Joined Groups</Text>
            </View>

            <FlatList
                data={joinedGroups}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={colors.muted} />
                        <Text style={styles.emptyText}>You haven't joined any groups yet</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
    },
    logoutButton: {
        padding: 8,
    },
    profileSection: {
        backgroundColor: colors.card,
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    email: {
        fontSize: 16,
        color: colors.text,
        fontWeight: "500",
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.card,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginLeft: 8,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginLeft: 8,
    },
    subjectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    subject: {
        fontSize: 14,
        color: colors.muted,
        marginLeft: 4,
    },
    description: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: colors.muted,
        marginLeft: 4,
    },
    creator: {
        fontSize: 12,
        color: colors.muted,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: colors.muted,
        marginTop: 16,
    },
});

export default ProfileScreen;
