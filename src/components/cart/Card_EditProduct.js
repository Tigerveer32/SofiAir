import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

export default function CardEditProduct(params) {
  const [harga, setHarga] = useState("");
  const [produk, setProduk] = useState("");
  const [stok, setStok] = useState(""); // Initialize with an empty string
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
        setProduk(params?.produk); // Set produk value from params
        setHarga(params?.harga); // Set harga value from params
        setStok(params?.stok); // Set stok value from params
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

  //updatedata
  const handleUpdateProduct = async (productId) => {
    try {
      const docRef = doc(db, "listProduct", productId);
      if (stok === "" || stok === "0") {
        // Check if stok is empty or "0"
        alert("Silahkan masukkan jumlah produk");
        return;
      }
      if (produk === "") {
        alert("Silahkan masukkan nama produk");
        return;
      }
      if (harga === "") {
        alert("Silahkan masukkan harga produk");
        return;
      }

      const stokNumber = Number(stok);

      await updateDoc(docRef, {
        produk: produk,
        harga: harga,
        stok: stokNumber,
      });

      console.log("Product updated:", { produk, harga, stok });
      alert("Berhasil memperbarui data");
      // Reset stok value to empty string
      setStok("");
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const docRef = doc(db, "listProduct", productId);
      await deleteDoc(docRef);
      console.log("Product deleted:", productId);
      alert("Berhasil menghapus data");
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

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
        <Text>{params?.productId}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <TextInput
          style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
          placeholder={params?.produk}
          onChangeText={(text) => setProduk(text)}
          value={produk}
        />
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <TextInput
          style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
          placeholder={params?.harga}
          onChangeText={(text) => setHarga(text)}
          value={harga}
        />
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <TextInput
          style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
          onChangeText={(text) => setStok(text)}
          value={String(stok)}
          placeholder={String(params?.stok)}
          keyboardType="numeric"
        />
      </View>
      <View style={{ flex: 1, padding: 5 }}>
        <Button
          title="Simpan"
          onPress={() => handleUpdateProduct(params?.productId)}
          style={{ width: 8 }}
        />
        <Button
          title="Hapus"
          onPress={() => handleDeleteProduct(params?.productId)}
          style={{ width: 8 }}
        />
      </View>
    </View>
  );
}
