import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const LoadingScreen = ({ navigation }) => {
  const uid = auth.currentUser.uid;
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRole(data.role);
          console.log(data.role);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (role === "admin") {
      navigation.navigate("Main");
    } else if (role === "karyawan") {
      navigation.navigate("Karyawan");
    }
  }, [role]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingScreen;
