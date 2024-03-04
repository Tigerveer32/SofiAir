import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export default function CardDashboardProduct({ product, navigation }) {// Initialize with an empty string
  const [productData, setProductData] = useState([]);

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
        marginRight: 5,
        marginLeft: 10,
      }}
    >
      <View style={{ padding: 10, marginLeft: 5 }}>
        <Text>{product?.productId}</Text>
      </View>
      <View style={{ flex: 1, padding: 10, marginRight: 10 }}>
        <Text>{product?.produk}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <Text>{product?.harga}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <Text>{product?.stok}</Text>
        {/* <TextInput
          style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
          onChangeText={(text) => setStok(text)}
          value={String(stok)}
          placeholder={String(product?.stok)}
          keyboardType="numeric"
        /> */}
      </View>
      <View style={{ flex: 1, padding: 5 }}>
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditProdukScreen")}
        style={{ width: 10 }}
      />
        {/* <Button
          title="Simpan"
          onPress={() => handleUpdateProduct(params?.productId)}
          style={{ width: 10 }}
        /> */}
      </View>
    </View>
  );
}
