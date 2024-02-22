import {
    StyleSheet,
    View,
    Image,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
  } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation("");
  
    const login = () => {
      if (email === "" || password === "") {
        Alert.alert(
          "Invalid Detials",
          "Invalid email or password. Please check and try again.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      }
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
  
      if (password.length < 6) {
        Alert.alert(
          "Invalid Password",
          "Password must be at least 6 characters long."
        );
        return;
      }
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        console.log("user credential", userCredential);
        const user = userCredential.user;
        console.log("user details", user);
      });
    };
  
    useEffect(() => {
      try {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
          if (authUser) {
            navigation.replace("Loading");
          }
        });
  
        return unsubscribe;
      } catch (e) {
        console.log(e);
      }
    }, []);
  
    return (<SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 5,
          alignItems: "center",
        }}
      >
        <KeyboardAvoidingView>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../assets/logo.png")}
              style={{ width: '50%', height: '50%' }}
            />
            <Text style={{ marginTop: 0, fontSize: 18, fontWeight: "500" }}>
              Silahkan masukkan email dan password anda untuk login
            </Text>
          </View>
  
          <View style={{ marginLeft:  40, marginRight: 20 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray"}}>
                Email
              </Text>
  
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="enter your email id"
                placeholderTextColor={"black"}
                style={{
                  fontSize: email ? 18 : 18,
                  borderBottomWidth: 1,
                  borderBottomColor: "gray",
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
  
            <View style={{ marginTop: 5 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Password
              </Text>
  
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor={"black"}
                returnKeyType="done"
                onSubmitEditing={()=>{

                }}
                style={{
                  fontSize: password ? 18 : 18,
                  borderBottomWidth: 1,
                  borderBottomColor: "gray",
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
          </View>
  
          <Pressable
            onPress={login}
            style={{
              width: 200,
              backgroundColor: "royalblue",
              padding: 15,
              borderRadius: 7,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>
  
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 17 }}>
              Don't have an account? Sign up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default LoginScreen;
  
  const styles = StyleSheet.create({});