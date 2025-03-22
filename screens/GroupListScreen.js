// screens/GroupsListScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { collection, onSnapshot, query, orderBy, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import colors from "../theme/colors";

const GroupsListScreen = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const groupsRef = collection(db, "studyGroups");
        const q = query(groupsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groupList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGroups(groupList);
            setLoading(false);
        });

        return () => unsubscribe();
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
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subject}>📚 {item.subject}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>🗓 {item.date}</Text>
            <Text style={styles.creator}>Posted by: {item.createdBy}</Text>

            <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinGroup(item)}
            >
                <Text style={styles.joinText}>Join Group</Text>
            </TouchableOpacity>
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
        <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 4,
    },
    subject: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 6,
    },
    date: {
        fontSize: 13,
        color: colors.muted,
        marginBottom: 4,
    },
    creator: {
        fontSize: 12,
        color: colors.muted,
        marginBottom: 12,
    },
    joinButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    joinText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
    },
});

export default GroupsListScreen;
