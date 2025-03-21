// screens/PostGroupScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView
} from "react-native";
import { db } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from "../config/firebase";


const PostGroupScreen = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const handlePost = async () => {
        if (!title || !subject || !description || !date) {
            Alert.alert("Please fill all fields");
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
            // Clear the form
            setTitle("");
            setSubject("");
            setDescription("");
            setDate("");
            navigation.goBack(); // Go back to Home after posting
        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Error", "Could not post group.");
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Study Group</Text>

            <TextInput
                style={styles.input}
                placeholder="Group Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Subject"
                value={subject}
                onChangeText={setSubject}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
            />

            <TextInput
                style={styles.input}
                placeholder="Date (e.g. Mar 25, 5:00 PM)"
                value={date}
                onChangeText={setDate}
            />

            <Button title="Post Study Group" onPress={handlePost} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
});

export default PostGroupScreen;
