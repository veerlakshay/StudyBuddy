// App.js
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import { SafeAreaView } from "react-native";
import colors from "./theme/colors";
import { useEffect } from "react";
import { cleanupExpiredGroups } from "./utils/groupCleanup";

export default function App() {
  useEffect(() => {
    // Run cleanup every hour
    const cleanupInterval = setInterval(cleanupExpiredGroups, 60 * 60 * 1000);
    
    // Run initial cleanup
    cleanupExpiredGroups();
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaView>
  );
}
