// screens/LoginScreen.js
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../theme/colors";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Logged in successfully!");
            navigation.replace("Home");
        } catch (error) {
            Alert.alert("Login Error", error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Text style={styles.title}>Welcome Back 👋</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={colors.muted}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor={colors.muted}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <Text style={styles.linkText}>
                Don’t have an account?
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate("Signup")}
                >
                    {" "}
                    Sign Up
                </Text>
            </Text>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 18,
    },
    linkText: {
        marginTop: 20,
        textAlign: "center",
        color: colors.text,
    },
    link: {
        color: colors.primary,
        fontWeight: "bold",
    },
});

export default LoginScreen;
