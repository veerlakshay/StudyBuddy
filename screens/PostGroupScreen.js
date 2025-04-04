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
    View,
    Image,
    Animated,
    ActivityIndicator,
} from "react-native";
import { db, auth } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const PostGroupScreen = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const buttonScale = new Animated.Value(1);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = new Date();
            if (selectedDate < currentDate) {
                Alert.alert("Invalid Date", "Please select a future date");
                return;
            }
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };

    const handlePost = async () => {
        if (!title || !subject || !description || !date) {
            Alert.alert("All fields are required.");
            return;
        }

        // Parse the date string into a Date object
        const groupDate = new Date(date);
        if (isNaN(groupDate.getTime())) {
            Alert.alert("Invalid Date", "Please enter a valid date and time.");
            return;
        }

        // Check if the date is in the past
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const groupDateOnly = new Date(groupDate);
        groupDateOnly.setHours(0, 0, 0, 0);

        if (groupDateOnly < now) {
            Alert.alert("Invalid Date", "The group date cannot be in the past.");
            return;
        }

        setIsSubmitting(true);
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        try {
            await addDoc(collection(db, "studyGroups"), {
                title,
                subject,
                description,
                dateString: format(date, "MMM dd, yyyy 'at' hh:mm a"),
                dateTimestamp: Timestamp.fromDate(date),
                createdAt: Timestamp.now(),
                createdBy: auth.currentUser?.email,
            });

            Alert.alert("Success", "Study group posted!");
            setTitle("");
            setSubject("");
            setDescription("");
            setDate(new Date());
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.header}>Create Study Group</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="school-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Group Title"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor={colors.muted}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="book-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Subject"
                            value={subject}
                            onChangeText={setSubject}
                            placeholderTextColor={colors.muted}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="document-text-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor={colors.muted}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.dateTimeContainer}>
                        <TouchableOpacity 
                            style={styles.dateTimeButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            <Text style={styles.dateTimeText}>
                                {format(date, "MMM dd, yyyy")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.dateTimeButton}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Ionicons name="time-outline" size={20} color={colors.primary} />
                            <Text style={styles.dateTimeText}>
                                {format(date, "hh:mm a")}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={handleTimeChange}
                        />
                    )}

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity 
                            style={[styles.button, isSubmitting && styles.buttonDisabled]}
                            onPress={handlePost}
                            activeOpacity={0.8}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Create Group</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    header: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
        textAlign: "center",
    },
    formContainer: {
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    dateTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 4,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dateTimeText: {
        marginLeft: 8,
        fontSize: 16,
        color: colors.text,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 18,
    },
});

export default PostGroupScreen;
