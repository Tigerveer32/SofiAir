import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Pressable,
    TextInput,
    Alert
  } from "react-native";
  import {Picker} from '@react-native-picker/picker';
  import React, { useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { auth, db } from "../../../firebase";
  import { setDoc, doc } from "firebase/firestore";
  
  const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const navigation = useNavigation();
    const register = () => {
      if ( name === "" || email === "" || password === "" || role == ""  || phone === "") {
        Alert.alert(
          "Invalid Detials",
          "Please enter all the credentials",
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
      // Validasi format email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
  
      // Validasi panjang password
      if (password.length < 6) {
        Alert.alert(
          "Invalid Password",
          "Password must be at least 6 characters long."
        );
        return;
      }
  
      // Validasi nomor telepon
      if (!/^\d+$/.test(phone)) {
        Alert.alert(
          "Invalid Phone Number",
          "Phone number must contain only digits."
        );
        return;
      }
      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredentials) => {
          const user = userCredentials._tokenResponse.email;
          const uid = auth.currentUser.uid;
  
          setDoc(doc(db, "users", `${uid}`), {
            name: name,
            email: user,
            phone: phone,
            role: role,
          });
        }
      );
    };
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 10,
          alignItems: "center",
        }}
      >
        <KeyboardAvoidingView>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Text style={{ color: "royalblue", fontSize: 17, fontWeight: "700" }}>
              Register
            </Text>
  
            <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "500" }}>
              Create an Account
            </Text>
          </View>
  
          <View style={{ marginTop: 50 }}>
          <View>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Name
              </Text>
  
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="enter your name"
                placeholderTextColor={"black"}
                style={{
                  fontSize: email ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Email
              </Text>
  
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="enter your email"
                placeholderTextColor={"black"}
                style={{
                  fontSize: email ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
  
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Password
              </Text>
  
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor={"black"}
                style={{
                  fontSize: password ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>

            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Role
              </Text>
  
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={{
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
              >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Karyawan" value="karyawan" />
              </Picker>
            </View>
  
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Phone
              </Text>
  
              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(text)}
                placeholder="enter your Phone No"
                placeholderTextColor={"black"}
                style={{
                  fontSize: password ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
          </View>
  
          <Pressable
            onPress={register}
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
                textAlign: "center",
                color: "white",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </Pressable>
  
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 17 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({});