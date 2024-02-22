import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Button } from "react-native-elements";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransaksiScreen = ({ navigation }) => {
  const [lProdukLength, setLProdukLength] = useState(0);

  useEffect(() => {
    const fetchLProdukLength = async () => {
      try {
        const produkSaved = await AsyncStorage.getItem("produkSaved");
        const parsedProduk = JSON.parse(produkSaved);
        const length = parsedProduk ? parsedProduk.length : 0;
        setLProdukLength(length);
      } catch (e) {
        console.error("Error fetching produkSaved:", e);
      }
    };
    fetchLProdukLength();
  }, [lProdukLength]);

  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await AsyncStorage.removeItem("produkSaved");
    } catch (e) {
      // remove error
    }

    console.log("Done.");
  };

  const handleAddToCart = async (product) => {
    await saveProdukCart(
      product.id,
      product.produk,
      product.harga,
      product.qty
    );
    console.log("Product added to cart:", product);
    // Update lProdukLength
    const produkSaved = await AsyncStorage.getItem("produkSaved");
    const parsedProduk = JSON.parse(produkSaved);
    const length = parsedProduk ? parsedProduk.length : 0;
    setLProdukLength(length);
  };

  const saveProdukCart = async (productId, produk, harga, qty) => {
    // console.log("Product to be saved:", productId, produk, harga, qty);
    try {
      const product = {
        productId,
        produk,
        harga,
        qty,
      };

      console.log("Product to be saved 333:", productId, produk, harga, qty);
      const savedProduk = await AsyncStorage.getItem("produkSaved");
      if (savedProduk !== null) {
        let produkArray = JSON.parse(savedProduk);
        if (!Array.isArray(produkArray)) {
          produkArray = [];
        }
        const existingProductIndex = produkArray.findIndex(
          (item) => item.productId === productId
        );
        if (existingProductIndex !== -1) {
          produkArray[existingProductIndex].qty += qty;
          const updatedProduk = produkArray[existingProductIndex];
          produkArray.splice(existingProductIndex, 1, updatedProduk);
        } else {
          produkArray.push(product);
        }
        await AsyncStorage.setItem("produkSaved", JSON.stringify(produkArray));
      } else {
        await AsyncStorage.setItem("produkSaved", JSON.stringify([product]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "listProduct"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const renderProductItem = ({ item }) => {
    return (
      <Card>
        <Card.Title>{item.productId}</Card.Title>
        <Card.Title>{item.produk}</Card.Title>
        <Card.Divider />
        <Card.Image source={{ uri: item.imageUrl }} />
        <Text style={styles.productPrice}>Price: Rp : {item.harga}</Text>
        <Text style={styles.productPrice}>Stok : {item.stok}</Text>
        <Button
          title="Add to Cart"
          onPress={() => handleAddToCart({ ...item, qty: 1 })}
          buttonStyle={styles.addButton}
        />
        <Button
          title="delete from Cart"
          onPress={() => handleDelete(item.productId)}
          buttonStyle={styles.addButton}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Text>Cart ({lProdukLength})</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  productList: {
    paddingBottom: 20,
  },
  productPrice: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  addButton: {
    borderRadius: 5,
    backgroundColor: "royalblue",
  },
});

export default TransaksiScreen;
