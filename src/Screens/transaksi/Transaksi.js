import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Button } from "react-native-elements";
import { Entypo } from '@expo/vector-icons';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransaksiScreen = ({ navigation }) => {
  const [lProdukLength, setLProdukLength] = useState(0);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const produk = await AsyncStorage.getItem("produkSaved");
        if (produk !== null) {
          const parsedProduk = JSON.parse(produk);
          setProductData(parsedProduk);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const productLength = productData.reduce(
      (total, product) => total + product.qty,
      0
    );
    setLProdukLength(productLength);
  }, [productData]);

  const fetchProductQty = async (productId) => {
    try {
      const produk = await AsyncStorage.getItem("produkSaved");
      if (produk !== null) {
        const parsedProduk = JSON.parse(produk);
        const product = parsedProduk.find(
          (product) => product.productId === productId
        );
        if (product) {
          return product.qty;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  };

  const handleDeleteFromCart = async ( productId) => {
    try {
      const product = await AsyncStorage.getItem("produkSaved");
      const productData = JSON.parse(product)

      const productIndex = productData.findIndex(
        (product) => product.productId === productId
      );

      console.log("10", productIndex, productId);

      if (productIndex !== -1) {
        console.log("3");
        const product = productData[productIndex];
        let newProductData;

        if (product.qty > 1) {
          console.log("4");
          // Decrease the quantity by 1
          const newProduct = { ...product, qty: product.qty - 1 };
          newProductData = [...productData];
          newProductData[productIndex] = newProduct;
        } else {
          console.log("5");
          // Remove the product from the cart
          newProductData = productData.filter(
            (product) => product.productId !== productId
          );
        }
        console.log(newProductData)
        // Save the new productData to AsyncStorage
        await AsyncStorage.setItem(
          "produkSaved",
          JSON.stringify(newProductData)
        );
        // console.log(newProductData);
        // // Update the productData state
        setProductData(newProductData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = async (product, productId) => {
    try {
      // Check if the product stock is empty
      if (product.stok === 0) {
        alert("This product is out of stock!");
        return;
      }
      const currentQty = await fetchProductQty(product.productId);
      if (currentQty === product.stok) {
        alert("Cannot add more of this product to the cart!");
        return;
      }

      await saveProdukCart(
        product.id,
        product.produk,
        product.harga,
        product.qty
      );
      console.log("Product added to cart:", product.productId);
      // Update lProdukLength
      const newLProdukLength = lProdukLength + product.qty;
      setLProdukLength(newLProdukLength);
    } catch (e) {
      console.error(e);
    }
  };

  const saveProdukCart = async (productId, produk, harga, qty) => {
    try {
      const product = {
        productId,
        produk,
        harga,
        qty,
      };
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
    const fetchProducts = () => {
      const unsubscribe = onSnapshot(
        collection(db, "listProduct"),
        (querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setProducts(data);
        },
        (error) => {
          console.error("Error fetching products: ", error);
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
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
          onPress={() => {
          // console.log(item.productId)
            handleDeleteFromCart(item.productId);
          }}
          buttonStyle={styles.addButton}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaksi</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Entypo name="shopping-cart" size={25} color="black" />
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
      <Button
        title="Keranjang"
        onPress={() => navigation.navigate("CartScreen")}
        buttonStyle={styles.addButton}
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
    borderRadius: 20,
    backgroundColor: "royalblue",
  },
});

export default TransaksiScreen;
