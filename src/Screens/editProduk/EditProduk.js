import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { doc,getDocs, collection,onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import CardEditProduct from '../../components/cart/Card_EditProduct';

const Head_Table = ["No", "Nama Produk", "Harga", "Stok", "Action"];

export default function EditProdukScreen({navigation}) {
    const [productData, setProductData] = useState([]);
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
        <View style={{ flex: 1, marginTop: 40 }}>
      <View style={{ flexDirection: 'row', backgroundColor: '#CCCCCC' }}>
        {Head_Table.map((header, index) => (
          <View key={index} style={{ padding: 10, marginLeft:15 }}>
            <Text>{header}</Text>
          </View>
        ))}
      </View>
      {productData.map((product, index) => (
        <CardEditProduct {...product} key={index} />
      ))}
      <View>
    </View>
    </View>
    )

}