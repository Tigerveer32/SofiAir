import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { setDoc, doc } from "firebase/firestore";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();

  const register = async () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      role === "" ||
      phone === ""
    ) {
      Alert.alert(
        "Invalid Details",
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
      return;
    }

    // Validasi format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        Alert.alert(
          "Email Already Registered",
          "This email address is already registered. Please use a different email or login instead."
        );
        return;
      }
    } catch (error) {
      console.error("Error checking email registration:", error);
      Alert.alert(
        "Email Already Registered",
        "This email address is already registered. Please use a different email or login instead."
      );
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
    if (phone.length < 10 || !phone.startsWith("62")) {
      let errorMessage = "";
      if (phone.length < 10) {
        errorMessage = "Phone number must have at least 10 digits.";
      } else if (!phone.startsWith("62")) {
        errorMessage = "Phone number must start with '62'.";
      }

      Alert.alert("Invalid Phone Number", errorMessage);
      return;
    }

    // Register user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // Dapatkan ID pengguna yang baru dibuat
        const uid = userCredentials.user.uid;

        // Set dokumen pengguna di Firestore
        setDoc(doc(db, "users", uid), {
          name: name,
          email: email,
          phone: phone,
          role: role,
        })
          .then(() => {
            auth.signOut(); // Melakukan logout pengguna
            // Jika berhasil, navigasi ke halaman login
            navigation.navigate("Login");
          })
          .catch((error) => {
            console.error("Error setting user document:", error);
            // Handle error setting user document
          });
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        Alert.alert(
          "Email Already Registered",
          "This email address is already registered. Please use a different email or login instead."
        );
      });
  };
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredentials) => {
  //       const user = userCredentials._tokenResponse.email;
  //       const uid = auth.currentUser.uid;
  //       setDoc(doc(db, "users", `${uid}`), {
  //         name: name,
  //         email: user,
  //         phone: phone,
  //         role: role,
  //       });
  //     })
  //     .then(() => {
  //       auth.signOut(); // Melakukan logout pengguna
  //       navigation.navigate("Login");
  //     })
  //     .catch((error) => {
  //       console.error("Error signing up:", error);
  //       Alert.alert(
  //         "Email Already Registered",
  //         "This email address is already registered. Please use a different email or login instead."
  //       );
  //     });
  // };

  return (
    <ScrollView>
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
            <Text
              style={{ color: "royalblue", fontSize: 17, fontWeight: "700" }}
            >
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
                <Picker.Item label="Select Role" value="" />
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
                placeholder="Enter your Phone No"
                placeholderTextColor="black"
                style={{
                  fontSize: 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
                keyboardType="numeric"
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
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
