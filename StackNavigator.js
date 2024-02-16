import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; 
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./src/Screens/login/Login";
import homeScreen from "./src/Screens/home/Home";
import RegisterScreen from "./src/Screens/register/Register";
import DashboardScreen from "./src/Screens/dashboard/Dashboard";
import ProfileScreen from "./src/Screens/profil/Profil";
import TambahProdukScreen from "./src/Screens/tambahProduk/TambahProdukScreen";
import EditProdukScreen from "./src/Screens/editProduk/EditProduk";
import Splashscreen from "./src/components/splash/Splash";

const StackNavigator = () => {
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    const role = "admin"

    function BottomTabs() {
        return (
          <Tab.Navigator>
            {role == "karyawan" &&
              <Tab.Screen
              name="Home"
              component={homeScreen}
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
            />}
            {role == "admin" &&
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
                <Ionicons
                  name="home"
                  size={24}
                  color="black"
                />
              ),
          }}
        />
    }
            
        {
          role == "admin" &&
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
        }
        
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
              name="Main"
              component={BottomTabs}
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

          </Stack.Navigator>
        </NavigationContainer>
            );
}
export default StackNavigator;
