import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ModalPortal } from "react-native-modals";
import "tailwindcss/tailwind.css";
import StackNavigator from "./StackNavigator";
import { Provider } from "react-redux";
import store from "./src/store/store";
import LoadingContext from "./src/components/Loading/LoadingContext";
import React, { useState } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Provider store={store}>
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <>
          <StackNavigator />
          <ModalPortal />
        </>
      </LoadingContext.Provider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
