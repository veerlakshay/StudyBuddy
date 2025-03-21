// navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostGroupScreen from "../screens/PostGroupScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import GroupsListScreen from "../screens/GroupsListScreen";


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="PostGroup" component={PostGroupScreen} />
                <Stack.Screen name="GroupsList" component={GroupsListScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
