import { View, Text, FlatList, StyleSheet, Modal, Platform } from "react-native";
import { Button } from "react-native-elements";
import * as React from 'react';
import { db } from "../../../firebase";
import { getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import CardLaporan from "../../components/cart/Card_Laporan";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function LaporanAdminScreen({ navigation }) {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    const fetchProducts = () => {
      const q = query(collection(db, "laporan"), orderBy("tgBayar", "desc")); // Sort by date descending
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setProductData(data);
        setFilteredData(data);
      }, (error) => {
        console.error("Error fetching products: ", error);
      });
      return () => unsubscribe();
    };
    fetchProducts();
  }, []);

  const filterData = () => {
    const filtered = productData.filter(item => {
      const itemDate = item.tgBayar.toDate();
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredData(filtered);
    setShowModal(false);
  };

  const printToPDF = async () => {
    // Prepare HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h2>Laporan Admin</h2>
          <table>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Produk</th>
              <th>Total Harga</th>
            </tr>
            ${filteredData.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.tgBayar.toDate().toLocaleDateString()}</td>
                <td>${item.product.map((produk) => (
                  `${produk.produk} x ${produk.qty}`
                )).join(', ')}</td>
                <td>${item.totalBayar}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    // Print the HTML content to a PDF file
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Check if the platform supports sharing
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await Sharing.shareAsync(uri);
    } else {
      console.log('PDF file generated:', uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, marginTop: 20 }}>
        <Text style={styles.title}>Laporan Admin</Text>
        <Button title="Print to PDF file" onPress={printToPDF} />
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
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            console.log(item);
            return <CardLaporan index={index} {...item} />;
          }}
        />
      </View>
      <Button title="Filter" onPress={() => setShowModal(true)}  buttonStyle={styles.Button}/>
      <Modal visible={showModal} animationType="slide">
        <View style={{ padding: 20 }}>
          <Button title="Select Start Date" onPress={() => setShowStartDatePicker(true)} />
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                setStartDate(selectedDate || startDate);
              }}
            />
          )}
          <Button title="Select End Date" onPress={() => setShowEndDatePicker(true)} />
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                setEndDate(selectedDate || endDate);
              }}
            />
          )}
          <Button title="Apply Filter" onPress={filterData} />
          <Button title="Cancel" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
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
