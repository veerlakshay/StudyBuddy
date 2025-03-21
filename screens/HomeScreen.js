// screens/HomeScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const HomeScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace("Login");
        } catch (error) {
            alert("Error logging out: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to StudyBuddy! 🎓</Text>
            <Text style={styles.email}>Logged in as: {auth.currentUser?.email}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Logout" onPress={handleLogout} />
                <Button
                    title="Create Study Group"
                    onPress={() => navigation.navigate("PostGroup")}
                />
                <Button
                    title="View Study Groups"
                    onPress={() => navigation.navigate("GroupsList")}
                />


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    email: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        color: "#666",
    },
    buttonContainer: {
        marginHorizontal: 40,
    },
});

export default HomeScreen;
