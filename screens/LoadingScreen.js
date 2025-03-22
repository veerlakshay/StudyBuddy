// screens/LoadingScreen.js
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const LoadingScreen = ({ navigation }) => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace("Home");
            } else {
                navigation.replace("Login");
            }
        });

        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
});

export default LoadingScreen;
