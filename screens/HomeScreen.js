// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../theme/colors";

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
            <Text style={styles.welcome}>🎓 Welcome to StudyBuddy!</Text>
            <Text style={styles.subtext}>Logged in as: {auth.currentUser?.email}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primary]}
                    onPress={() => navigation.navigate("PostGroup")}
                >
                    <Text style={styles.buttonText}>+ Create Study Group</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondary]}
                    onPress={() => navigation.navigate("GroupsList")}
                >
                    <Text style={styles.buttonText}>📋 View All Groups</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.tertiary]}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <Text style={styles.buttonText}>👥 My Joined Groups</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.danger]}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>🚪 Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
        justifyContent: "center",
    },
    welcome: {
        fontSize: 26,
        fontWeight: "700",
        textAlign: "center",
        color: colors.primary,
        marginBottom: 10,
    },
    subtext: {
        textAlign: "center",
        fontSize: 14,
        color: colors.muted,
        marginBottom: 30,
    },
    buttonContainer: {
        gap: 16,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        elevation: 3,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    tertiary: {
        backgroundColor: "#A78BFA", // purple-ish
    },
    danger: {
        backgroundColor: colors.danger,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default HomeScreen;
