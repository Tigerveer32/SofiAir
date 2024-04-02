import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, Image } from "react-native-elements";
import { auth, db } from "../../../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import LoadingContext from "../../components/Loading/LoadingContext";
import { AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ProfileScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const uid = currentUser ? currentUser.uid : "";
  const [name, setName] = useState("");
  const uidEmail = currentUser ? currentUser.email : "";
  const [email, setEmail] = useState(uidEmail);
  const [phone, setPhone] = useState("");
  const [userData, setUserData] = useState({});
  const { isLoading, setIsLoading } = useContext(LoadingContext);

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
    setIsLoading(true);
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        name: name,
        phone: phone,
      });
      console.log("Profile updated:", { name, email, phone });
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setIsLoading(false);
      // Handle failure to update profile
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="black" />
          <Text>Logout</Text>
        </TouchableOpacity>
        {/* <Button
        title="Logout"
        onPress={handleLogout}
        buttonStyle={[styles.Button]} // Apply logoutButton style
      /> */}
      </View>
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
        disabled={(!name && !phone) || isLoading} // Disable button if no changes made or if loading
        buttonStyle={styles.Button}
        loading={isLoading} // Show loading spinner if isLoading is true
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: windowWidth * 0.1, // 10% of the window width
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userPhoto: {
    width: windowWidth * 0.2, // 20% of the window width
    height: windowWidth * 0.2, // 20% of the window width
    borderRadius: (windowWidth * 0.2) / 2, // Half of the width to make it a circle
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
    width: windowWidth * 0.8, // 80% of the window width
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  Button: {
    borderRadius: 20,
    backgroundColor: "royalblue",
    width: windowWidth * 0.8, // 80% of the window width
    alignSelf: "center", // Center the button horizontally
  },
  logoutButton: {
    position: "absolute", // Position button absolutely
    top: 30, // 10 pixels from the top
    left: 20, // 10 pixels from the left
  },
});

export default ProfileScreen;
