import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ModalPortal } from "react-native-modals";
import 'tailwindcss/tailwind.css';
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <>
      <StackNavigator />
      <ModalPortal/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});