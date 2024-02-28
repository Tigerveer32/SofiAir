import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { auth, db } from "../../../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import CardDashboardProduct from "../../components/cart/Card_Dashboard";

const Head_Table = ["No", "Nama Produk", "Harga", "Stok Update"];

export default function DashboardScreen({ navigation }) {
  const [productData, setProductData] = useState([]);

  // Fetch Data dari firebase
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const docSnap = await getDocs(collection(db, "listProduct"));
        const productList = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // Set stok value from params
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, marginTop: 20 }}>
        
      <Text style={styles.title}>Product</Text>
        <View style={{ flexDirection: "row", backgroundColor: "#CCCCCC" }}>
          {Head_Table.map((header, index) => (
            <View key={index} style={{ padding: 10 }}>
              <Text>{header}</Text>
            </View>
          ))}
        </View>
        {productData.map((product, index) => (
          <CardDashboardProduct {...product} key={index} />
        ))}
      </View>
      <Button
        title="Tambah produk"
        onPress={() => navigation.navigate("TambahProdukScreen")}
        buttonStyle={styles.Button}
      />
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditProdukScreen")}
        buttonStyle={styles.Button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Button: {
    borderRadius: 20,
    backgroundColor: "royalblue",
  },title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  }
});

