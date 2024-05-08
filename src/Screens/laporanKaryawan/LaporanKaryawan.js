import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";
import CardLaporan from "../../components/cart/Card_Laporan";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../../firebase";

export default function LaporanKaryawanScreen({ navigation }) {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchProducts = () => {
      const todayStart = startOfDay(new Date()); // Waktu mulai hari ini
      const todayEnd = endOfDay(new Date()); // Waktu akhir hari ini

      console.log(todayStart, todayEnd);
      const q = query(
        collection(db, "laporan"),
        orderBy("tgBayar", "desc"), // Urutkan berdasarkan tanggal bayar secara descending
        where("tgBayar", ">=", todayStart), // Filter data dimulai dari waktu mulai hari ini
        where("tgBayar", "<=", todayEnd) // Filter data sampai waktu akhir hari ini
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setProductData(data);
          setFilteredData(data);
        },
        (error) => {
          console.error("Error fetching products: ", error);
        }
      );
      return () => unsubscribe();
    };
    fetchProducts();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, marginTop: 20 }}>
        <Text style={styles.title}>Laporan Harian</Text>
        <View style={{ flexDirection: "row", backgroundColor: "#CCCCCC" }}>
          <View style={{ padding: 10, marginLeft: 10 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#CCCCCC",
    padding: 10,
    marginLeft: 10,
  },
});
