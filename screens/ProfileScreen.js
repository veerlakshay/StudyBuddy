// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { auth, db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import colors from "../theme/colors";

const ProfileScreen = () => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const joinedRef = collection(db, "users", userId, "joinedGroups");

        const unsubscribe = onSnapshot(joinedRef, (snapshot) => {
            const groups = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJoinedGroups(groups);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subject}>📚 {item.subject}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>🗓 {item.date}</Text>
            <Text style={styles.creator}>Posted by: {item.createdBy}</Text>
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
            <Text style={styles.heading}>👥 My Joined Groups</Text>
            {joinedGroups.length === 0 ? (
                <Text style={styles.emptyText}>You haven't joined any groups yet.</Text>
            ) : (
                <FlatList
                    data={joinedGroups}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 20,
        textAlign: "center",
    },
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
        marginBottom: 4,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
    },
    emptyText: {
        textAlign: "center",
        color: colors.muted,
        fontSize: 16,
        marginTop: 30,
    },
});

export default ProfileScreen;
