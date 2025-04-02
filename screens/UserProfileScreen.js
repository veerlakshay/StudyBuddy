import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import colors from '../theme/colors';

const UserProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        displayName: '',
        bio: '',
        avatarUrl: null,
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userId = auth.currentUser.uid;
            const userDoc = await getDoc(doc(db, 'users', userId));
            
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                setUserData({
                    displayName: auth.currentUser.email.split('@')[0],
                    bio: '',
                    avatarUrl: null,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setSaving(true);
                const imageUri = result.assets[0].uri;
                const response = await fetch(imageUri);
                const blob = await response.blob();
                
                const userId = auth.currentUser.uid;
                const storageRef = ref(storage, `avatars/${userId}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                
                setUserData(prev => ({ ...prev, avatarUrl: downloadURL }));
                setSaving(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload image');
            setSaving(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const userId = auth.currentUser.uid;
            await updateDoc(doc(db, 'users', userId), userData);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity 
                        style={styles.avatarButton}
                        onPress={pickImage}
                        disabled={saving}
                    >
                        {userData.avatarUrl ? (
                            <Image 
                                source={{ uri: userData.avatarUrl }} 
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={40} color={colors.muted} />
                            </View>
                        )}
                        <View style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarText}>Tap to change photo</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.displayName}
                        onChangeText={(text) => setUserData(prev => ({ ...prev, displayName: text }))}
                        placeholder="Enter your display name"
                        placeholderTextColor={colors.muted}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        value={userData.bio}
                        onChangeText={(text) => setUserData(prev => ({ ...prev, bio: text }))}
                        placeholder="Tell us about yourself"
                        placeholderTextColor={colors.muted}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.emailContainer}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.emailText}>{auth.currentUser.email}</Text>
                </View>
            </ScrollView>
        </View>
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
    saveButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    saveButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarButton: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.background,
    },
    avatarText: {
        color: colors.muted,
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: colors.text,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    emailContainer: {
        marginBottom: 20,
    },
    emailText: {
        fontSize: 16,
        color: colors.muted,
    },
});

export default UserProfileScreen; 