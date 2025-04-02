// screens/GroupsListScreen.js
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
import { collection, onSnapshot, query, orderBy, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import colors from "../theme/colors";
import { isGroupExpired } from "../utils/groupCleanup";
import { Ionicons } from "@expo/vector-icons";

const GroupsListScreen = ({ navigation }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchGroups = () => {
        const groupsRef = collection(db, "studyGroups");
        const q = query(groupsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groupList = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(group => !isGroupExpired(group.dateTimestamp));
            setGroups(groupList);
            setLoading(false);
            setRefreshing(false);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchGroups();
        return () => unsubscribe();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchGroups();
    }, []);

    const handleJoinGroup = async (group) => {
        try {
            const userId = auth.currentUser.uid;
            const joinedRef = doc(db, "users", userId, "joinedGroups", group.id);
            await setDoc(joinedRef, group);
            alert("🎉 You joined this group!");
        } catch (error) {
            alert("❌ Error: " + error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                    <Ionicons name="school-outline" size={24} color={colors.primary} />
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => handleJoinGroup(item)}
                >
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.joinText}>Join</Text>
                </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Study Groups</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={colors.muted} />
                        <Text style={styles.emptyText}>No study groups available</Text>
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
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
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
    joinButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    joinText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 4,
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

export default GroupsListScreen;
