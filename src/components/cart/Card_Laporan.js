import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

export default function CardLaporan(props) {
  console.log(props);

  const time = props.tgBayar;
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
 // Define options for Indonesian date format
 const options = {  year: 'numeric', month: 'long', day: 'numeric' };

 // Format the date in Indonesian format
 const date = fireBaseTime.toLocaleDateString('id-ID', options);


  // Format totalBayar as number with locale-specific representation
  const ToBay = props.totalBayar.toLocaleString();


  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row", // Added flexDirection to display in rows
        padding: 5,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
      }}
    >
      {/* Column 1: Date */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ fontSize: 12}}>{date}</Text>
      </View>

      {/* Column 2: Products */}
      <View style={{ flex: 2, marginLeft:10 }}>
        {props.product.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 9 }}>{item.produk}</Text>
            <Text style={{ fontSize: 10 }}>Rp: {item.harga}</Text>
            <Text style={{ fontSize: 10 }}> X {item.qty} = </Text>
            <Text style={{ fontSize: 10 }}>
              Rp: {item.qty * item.harga}
            </Text>
          </View>
        ))}
      </View>

      {/* Column 3: Total Payment */}
      <View style={{ flex: 1, marginLeft:20 }}>
        <Text
          style={{
            fontSize: 12,
          }}
        >
          Rp: {ToBay}
        </Text>
      </View>
    </View>
  );
}
