import React, { useState, useEffect } from "react";
import { Text, View ,StyleSheet} from "react-native";
import { Button } from "react-native-elements";
import CardCartScreen from "../../components/cart/Card_Cart";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen({ navigation }) {
  const [productData, setProductData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);

  // Fetch Data dari local
  useEffect(() => {
    const CartData = async () => {
      try {
        const produk = await AsyncStorage.getItem("produkSaved");
        console.log({ produk });
        if (produk !== null) {
          // Parse the data and set it to productData state
          const parsedProduk = JSON.parse(produk);
          setProductData(parsedProduk);
        }
      } catch (e) {
        console.error(e);
      }
    };
    CartData();
  }, []);

  // Calculate total payment whenever productData changes
  useEffect(() => {
    const total = productData.reduce(
      (sum, product) => sum + product.harga * product.qty,
      0
    );
    setTotalPayment(total);
  }, [productData]);

  return (
    <View style={{ flex: 2, marginTop: 20 }}>
      <Text>Keranjang</Text>
      {productData.map((product, index) => (
        <CardCartScreen {...product} key={index} />
      ))}
      <Text>Total Bayar: Rp {totalPayment}</Text>
      <View>
      <Button
        title="Checkout"
        onPress={() => navigation.navigate("CheckoutScreen", { totalPayment: totalPayment, productData: productData})} 
        buttonStyle={styles.Button}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Button: {
    borderRadius: 20,
    backgroundColor: "royalblue",
  },
});
