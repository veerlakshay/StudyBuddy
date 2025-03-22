// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { auth, db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

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
            <Text style={styles.subject}>Subject: {item.subject}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>📅 {item.date}</Text>
            <Text style={styles.creator}>Posted by: {item.createdBy}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <FlatList
            data={joinedGroups}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No groups joined yet.</Text>}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    subject: {
        fontSize: 16,
        marginTop: 5,
    },
    description: {
        fontSize: 14,
        marginTop: 8,
    },
    date: {
        marginTop: 10,
        color: "gray",
    },
    creator: {
        marginTop: 4,
        fontSize: 12,
        color: "gray",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
    },
});

export default ProfileScreen;
