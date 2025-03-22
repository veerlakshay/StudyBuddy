// screens/GroupsListScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { TouchableOpacity } from "react-native";


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

        return () => unsubscribe(); // Unsubscribe when component unmounts
    }, []);

    const handleJoinGroup = async (group) => {
        try {
            const userId = auth.currentUser.uid;
            const joinedGroupRef = doc(db, "users", userId, "joinedGroups", group.id);

            await setDoc(joinedGroupRef, group);
            alert("You joined this group!");
        } catch (error) {
            alert("Error joining group: " + error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subject}>Subject: {item.subject}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>📅 {item.date}</Text>
            <Text style={styles.creator}>Posted by: {item.createdBy}</Text>

            <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinGroup(item)}
            >
                <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
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
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
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
    joinButton: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: "#1e90ff",
        borderRadius: 6,
        alignItems: "center",
    },
    joinButtonText: {
        color: "#fff",
        fontWeight: "bold",
    }

});

export default GroupsListScreen;
