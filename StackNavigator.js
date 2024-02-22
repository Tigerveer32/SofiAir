import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./src/Screens/login/Login";
import TransaksiScreen from "./src/Screens/transaksi/Transaksi";
import RegisterScreen from "./src/Screens/register/Register";
import DashboardScreen from "./src/Screens/dashboard/Dashboard";
import ProfileScreen from "./src/Screens/profil/Profil";
import TambahProdukScreen from "./src/Screens/tambahProduk/TambahProdukScreen";
import EditProdukScreen from "./src/Screens/editProduk/EditProduk";
import Splashscreen from "./src/components/splash/Splash";
import CartScreen from "./src/Screens/cart/Cart";
import CheckoutScreen from "./src/Screens/checkout/Checkout";
import LoadingScreen from "./src/Screens/loading/Loading";

const StackNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function KaryawanTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Transaksi"
          component={TransaksiScreen}
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="royalblue" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="royalblue" />
              ) : (
                <Ionicons name="person" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="home" size={24} color="royalblue" />
              ) : (
                <Ionicons name="home" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="royalblue" />
              ) : (
                <Ionicons name="person" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splashscreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Karyawan"
          component={KaryawanTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TambahProdukScreen"
          component={TambahProdukScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProdukScreen"
          component={EditProdukScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="CheckoutScreen"
          component={CheckoutScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigator;
