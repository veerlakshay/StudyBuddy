// screens/PostGroupScreen.js
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { db, auth } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import colors from "../theme/colors";

const PostGroupScreen = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const handlePost = async () => {
        if (!title || !subject || !description || !date) {
            Alert.alert("All fields are required.");
            return;
        }

        try {
            await addDoc(collection(db, "studyGroups"), {
                title,
                subject,
                description,
                date,
                createdAt: Timestamp.now(),
                createdBy: auth.currentUser?.email,
            });

            Alert.alert("Success", "Study group posted!");
            setTitle("");
            setSubject("");
            setDescription("");
            setDate("");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>📌 Create a Study Group</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Group Title"
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor={colors.muted}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Subject"
                    value={subject}
                    onChangeText={setSubject}
                    placeholderTextColor={colors.muted}
                />

                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    placeholderTextColor={colors.muted}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Date & Time (e.g. Mar 28, 5PM)"
                    value={date}
                    onChangeText={setDate}
                    placeholderTextColor={colors.muted}
                />

                <TouchableOpacity style={styles.button} onPress={handlePost}>
                    <Text style={styles.buttonText}>📤 Post Group</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 30,
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
});

export default PostGroupScreen;
