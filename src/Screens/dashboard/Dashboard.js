import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import { auth, db } from "../../../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import CardDashboardProduct from "../../components/cart/Card_Dashboard";
import { useFocusEffect } from "@react-navigation/native";
import LoadingContext from "../../components/Loading/LoadingContext";
import { FontAwesome6 } from "@expo/vector-icons";

export default function DashboardScreen({ navigation }) {
  const [productData, setProductData] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      return () => {}; // optional cleanup function
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
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => {
              if (!isLoading) {
                setIsLoading(true);
                navigation.navigate("EditProdukScreen");
              }
            }}
            disabled={isLoading}
          >
            <FontAwesome6 name="edit" size={24} color="black" />
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#CCCCCC" }}>
          <View style={{ padding: 10,marginLeft:10 }}>
            <Text>No</Text>
          </View>
          <View>
            <Text style={{ padding: 10 ,marginLeft:10}}>Nama Produk</Text>
          </View>
          <View>
            <Text style={{ padding: 10 ,marginLeft:40}}>Harga</Text>
          </View>
          <View>
            <Text style={{ padding: 10, marginLeft: 45 }}>Stok</Text>
          </View>
        </View>
        {productData.map((product, index) => (
          <CardDashboardProduct
            key={index}
            product={product}
            navigation={navigation}
          />
        ))}
      </View>
      <Button
        title="Tambah produk"
        onPress={() => {
          if (!isLoading) {
            setIsLoading(true);
            navigation.navigate("TambahProdukScreen");
          }
        }}
        buttonStyle={styles.Button}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Button: {
    borderRadius: 20,
    backgroundColor: "royalblue",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
