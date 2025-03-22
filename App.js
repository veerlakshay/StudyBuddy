// App.js
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import { SafeAreaView } from "react-native";
import colors from "./theme/colors";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaView>
  );
}
