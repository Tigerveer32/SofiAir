import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import * as React from "react";
import { db } from "../../../firebase";
import {
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import CardLaporan from "../../components/cart/Card_Laporan";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LaporanAdminScreen({ navigation }) {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = () => {
      const q = query(collection(db, "laporan"), orderBy("tgBayar", "desc")); // Sort by date descending
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

  const filterData = () => {
    const filtered = productData.filter((item) => {
      const itemDate = item.tgBayar.toDate();
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredData(filtered);
    setShowModal(false);
  };

  const printToPDF = async () => {
    setIsLoading(true);
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
            ${filteredData
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.tgBayar.toDate().toLocaleDateString()}</td>
                <td>${item.product
                  .map((produk) => `${produk.produk} x ${produk.qty}`)
                  .join(", ")}</td>
                <td>${item.totalBayar}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;

    // Print the HTML content to a PDF file
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Define the new file path
    const newUri = FileSystem.documentDirectory + "LaporanAdmin.pdf";

    // Move the file to the new location
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });
    setIsLoading(false);

    console.log("PDF file saved to:", newUri);

    // Check if the platform supports sharing
    if (Platform.OS === "ios" || Platform.OS === "android") {
      await Sharing.shareAsync(newUri);
    } else {
      console.log("Sharing not supported on this platform.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, marginTop: 20 }}>
        <View>
          <Text style={styles.title}>Laporan Admin</Text>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={printToPDF}>
              <Feather name="save" size={30} color="black" />
              <Text>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Button title="Print to PDF file" onPress={printToPDF} /> */}
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
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            console.log(item);
            return <CardLaporan index={index} {...item} />;
          }}
        />
      </View>
      <Button
        title="Filter"
        onPress={() => {
          if (!isLoading) {
            setShowModal(true);
          }
        }}
        buttonStyle={styles.Button}
        loading={isLoading}
      />
      <Modal visible={showModal} animationType="slide">
        <View style={{ padding: 20 }}>
          <Button
            title="Select Start Date"
            onPress={() => setShowStartDatePicker(true)}
          />
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
          <Button
            title="Select End Date"
            onPress={() => setShowEndDatePicker(true)}
          />
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
    color: "royalblue",
    backgroundColor: "royalblue",
    width: windowWidth * 0.8, // 80% of the window width
    alignSelf: 'center', // Center the button horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowWidth * 0.1, // 10% of the window width
  },
});
