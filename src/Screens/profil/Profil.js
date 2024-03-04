import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button, Image } from "react-native-elements";
import { auth, db } from "../../../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const uid = currentUser ? currentUser.uid : "";
  const [name, setName] = useState("");
  const uidEmail = currentUser ? currentUser.email : "";
  const [email, setEmail] = useState(uidEmail);
  const [phone, setPhone] = useState("");
  const [userData, setUserData] = useState({});

  const clearUserData = () => {
    setName("");
    setEmail("");
    setPhone("");
    setUserData({});
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
            setUserData(data);
          } else {
            console.log("No such document!");
          }
        });

        return () => unsubscribe(); // Unsubscribe when component unmounts
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Melakukan logout pengguna
      console.log("User logged out successfully");
      clearUserData();
      await AsyncStorage.removeItem("produkSaved");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        name: name,
        phone: phone,
      });
      console.log("Profile updated:", { name, email, phone });
    } catch (error) {
      console.error("Error updating profile: ", error);
      // Handle failure to update profile
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.profileInfo}>
        <Ionicons name="person" size={50} color="black" />
          <Text style={styles.title}>Profile</Text>
        </View>
        <View>
          <Text>Email</Text>
        </View>
        <Text style={styles.textEmail}>{email}</Text>
        <View>
          <Text>Full Name</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <View>
          <Text>Phone</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
      </View>
      <Button
        title="Update Profile"
        onPress={handleUpdateProfile}
        disabled={!name && !phone} // Disable button if no changes made
        buttonStyle={styles.Button}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
        buttonStyle={styles.Button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  textName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textEmail: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  Button: {
    borderRadius: 20,
    backgroundColor: "royalblue",
  },
});

export default ProfileScreen;
