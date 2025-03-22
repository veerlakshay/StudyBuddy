// screens/SignupScreen.js
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../theme/colors";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Signup Error", error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Text style={styles.title}>Create Account</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.linkText}>
                Already have an account?
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate("Login")}
                >
                    {" "}
                    Log In
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

export default SignupScreen;
