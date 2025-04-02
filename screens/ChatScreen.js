import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import colors from '../theme/colors';
import { format } from 'date-fns';

const ChatScreen = ({ route, navigation }) => {
    const { groupId, groupTitle } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, 'studyGroups', groupId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const messageList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(messageList);
                setLoading(false);
            },
            (error) => {
                Alert.alert('Error', 'Failed to load messages');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [groupId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const messagesRef = collection(db, 'studyGroups', groupId, 'messages');
            await addDoc(messagesRef, {
                text: newMessage.trim(),
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                timestamp: serverTimestamp(),
            });
            setNewMessage('');
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const renderMessage = ({ item }) => {
        const isOwnMessage = item.userId === auth.currentUser.uid;

        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                {!isOwnMessage && (
                    <Text style={styles.senderName}>{item.userEmail}</Text>
                )}
                <View style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.ownBubble : styles.otherBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={styles.timestamp}>
                        {item.timestamp?.toDate() ? format(item.timestamp.toDate(), 'hh:mm a') : ''}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{groupTitle}</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.muted}
                    multiline
                />
                <TouchableOpacity 
                    style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!newMessage.trim()}
                >
                    <Ionicons 
                        name="send" 
                        size={24} 
                        color={newMessage.trim() ? colors.primary : colors.muted} 
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    ownMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        color: colors.muted,
        marginBottom: 4,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    ownBubble: {
        backgroundColor: colors.primary,
    },
    otherBubble: {
        backgroundColor: colors.card,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    ownMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: colors.text,
    },
    timestamp: {
        fontSize: 12,
        color: colors.muted,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        color: colors.text,
        maxHeight: 100,
    },
    sendButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default ChatScreen; 