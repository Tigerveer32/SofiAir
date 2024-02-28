import React from 'react';
import { View, Text, Button } from 'react-native';
import { doc, getDoc, updateDoc,addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../../../firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckoutScreen({ route, navigation }) {
  const { totalPayment, productData } = route.params;

  const handleCheckout = async () => {
    try {
      // Iterate over each product in the cart
      for (let product of productData) {
        // Fetch the current stock from Firebase
        const docRef = doc(db, "listProduct", product.productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentStock = data.stok;

          // Subtract the quantity from the cart
          const newStock = currentStock - product.qty;

          // Update the stock in Firebase
          await updateDoc(docRef, { stok: newStock });
        } else {
          console.log("No such document!");
        }
      }

      // Clear the cart
      await AsyncStorage.removeItem('produkSaved');
      // Create a new report with the product and timestamp
      const newReport = {
        product: productData,
        totalBayar: totalPayment,
        tgBayar : serverTimestamp(),
      };

      // Add the new report to the 'laporan' collection in Firebase
      await addDoc(collection(db, "laporan"), newReport);

      alert('Checkout complete!');
      navigation.navigate('Karyawan');
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Checkout</Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Total Payment: Rp {totalPayment}</Text>
      <Button title="Complete Checkout" onPress={handleCheckout} />
    </View>
  );
};