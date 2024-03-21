import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect,useContext } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import LoadingContext from "../Loading/LoadingContext";
import { useFocusEffect } from '@react-navigation/native';

export default function CardDashboardProduct({ product, navigation }) {
  // Initialize with an empty string
  const [productData, setProductData] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      return () => {};  // optional cleanup function
    }, [])
  );
  // Fetch Data dari firebase
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const docSnap = await getDocs(collection(db, "listProduct"));
        const productList = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductData(productList);
        // Listen for real-time updates
        const unsubscribe = onSnapshot(
          collection(db, "listProduct"),
          (snapshot) => {
            const updatedProductList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProductData(updatedProductList);
          }
        );
        return () => unsubscribe(); // Unsubscribe when component unmounts
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchProductData();
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#CCCCCC",
      }}
    >
      <View style={{ padding: 10, marginLeft: 10 }}>
        <Text>{product?.productId}</Text>
      </View>
      <View style={{ flex: 1, padding: 10, marginLeft: 20 }}>
        <Text>{product?.produk}</Text>
      </View>
      <View style={{ flex: 1, padding: 10, marginLeft:40 }}>
        <Text>{product?.harga}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <Text>{product?.stok}</Text>
      </View>
    </View>
  );
}
