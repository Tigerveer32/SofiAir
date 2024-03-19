import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { db } from "../../../firebase";
import { getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import CardLaporan from "../../components/cart/Card_Laporan";

export default function LaporanAdminScreen({ navigation }) {
  const [productData, setProductData] = useState();

  useEffect(() => {
    const fetchProducts = () => {
      const q = query(collection(db, "laporan"), orderBy("tgBayar", "desc")); // Mengurutkan berdasarkan tanggal terbaru
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setProductData(data);
      }, (error) => {
        console.error("Error fetching products: ", error);
      });
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };
    fetchProducts();
  }, []);

  console.log("DATA", productData);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, marginTop: 20 }}>
        <Text style={styles.title}>Laporan Admin</Text>
        <View style={{ flexDirection: "row", backgroundColor: "#CCCCCC" }}>
          <View style={{ padding: 10, marginLeft:10 }}>
            <Text>No</Text>
          </View>
          <View>
            <Text style={{ padding: 10, marginLeft: 30 }}>Tanggal</Text>
          </View>
          <View>
            <Text style={{ padding: 10, marginLeft: 50 }}>Produk</Text>
          </View>
          <View>
            <Text style={{ padding: 10, marginLeft: 50 }}>Total Harga</Text>
          </View>
        </View>
        <FlatList
          data={productData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            console.log(item);
            return <CardLaporan index={index} {...item} />;
          }}
        />
      </View>
      <Button title="Filter" buttonStyle={styles.Button} />
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
