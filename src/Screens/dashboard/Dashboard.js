import React, { useState, useEffect } from "react";
import { Text, View, Button } from 'react-native';
import { auth, db } from "../../../firebase";
import { collection, getDocs ,onSnapshot } from "firebase/firestore";
import CardDashboardProduct from "../../components/cart/Card_Dashboard";


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

  return (
    <View style={{ flex: 2, marginTop: 20 }}>
      <Text>Products Table</Text>
      <View style={{ flexDirection: 'row', backgroundColor: '#CCCCCC' }}>
        {Head_Table.map((header, index) => (
          <View key={index} style={{ padding: 10 }}>
            <Text>{header}</Text>
          </View>
        ))}
      </View>
      {productData.map((product, index) => (
        <CardDashboardProduct {...product} key={index} />
      ))}
      <View>
      <Button 
        title="Tambah produk" 
        onPress={() => navigation.navigate('TambahProdukScreen')}
      />
      <Button 
        title="Edit" 
        onPress={() => navigation.navigate('EditProdukScreen')} 
        style={{ width: 10 }} 
      />
    </View>
    </View>
  );
}

