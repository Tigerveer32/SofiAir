import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput } from 'react-native';
import { auth, db } from "../../../firebase";
import { collection, getDocs, doc, updateDoc,onSnapshot } from "firebase/firestore";

const Head_Table = ["No", "Nama Produk", "Harga", "Stok Update"];

export default function DashboardScreen({ navigation }) {
  const [stok, setStok] = useState([]);
  const [productData, setProductData] = useState([]);

  // Fetch Data dari firebase
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const docSnap = await getDocs(collection(db, "listProduct"));
        const productList = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductData(productList);

        // Listen for real-time updates
        const unsubscribe = onSnapshot(collection(db, "listProduct"), (snapshot) => {
          const updatedProductList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProductData(updatedProductList);
        });

        return () => unsubscribe(); // Unsubscribe when component unmounts
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchProductData();
  }, []);

  const handleUpdateProduct = async (productId) => {
    try {
      const docRef = doc(db, "listProduct", productId);
      await updateDoc(docRef, {
        stok: stok,
      });
      console.log("Product updated:", { stok });
      alert('Berhasil memperbarui data');
      //set value stok menjadi null
        setStok('');
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  return (
    <View style={{ flex: 2, marginTop: 20 }}>
      <Text>Products Table</Text>
      <View style={{ flexDirection: 'row', backgroundColor: '#CCCCCC', marginRight: 10, marginLeft: 10 }}>
        {Head_Table.map((header, index) => (
          <View key={index} style={{ padding: 10 }}>
            <Text>{header}</Text>
          </View>
        ))}
      </View>
      {productData.map((product, index) => (
        <View key={index} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#CCCCCC', marginRight: 5, marginLeft: 10 }}>
          <View style={{ padding: 10, marginLeft: 5 }}>
            <Text>{product.productId}</Text>
          </View>
          <View style={{ flex: 1, padding: 10 }}>
            <Text>{product.produk}</Text>
          </View>
          <View style={{ flex: 1, padding: 10 }}>
            <Text>{product.harga}</Text>
          </View>
          <View style={{ flex: 1, padding: 20 }}>
            <TextInput
              style={{ height: 30, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setStok(text)}
              value={stok}
              placeholder={product.stok}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, padding: 5 }}>
            <Button title="Simpan" onPress={() => handleUpdateProduct(product.productId)} style={{ width: 10 }} />
            <Button title="Edit" onPress={() => handleUpdateProduct(product.productId)} style={{ width: 10 }} />
          </View>

        </View>
      ))}
      <View>
      <Button 
        title="Tambah produk" 
        onPress={() => navigation.navigate('TambahProdukScreen')}
      />
    </View>
    </View>
  );
}
