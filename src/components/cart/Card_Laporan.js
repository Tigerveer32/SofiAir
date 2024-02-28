import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

export default function CardLaporan(props) {
  console.log(props);

  const time = props.tgBayar;
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();

  return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: "#CCCCCC",
          marginRight: 5,
          marginLeft: 10,
          padding: 10,
          backgroundColor: "#f8f8f8",
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            margin: 10,
            backgroundColor: "#fff",
            borderRadius: 5,
          }}
        >
          <View style={{ flex: 2, alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {date} - {atTime}
            </Text>
          </View>
          {props.product.map((item) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 14 }}>{item.produk}</Text>
              <Text style={{ fontSize: 14 }}>Rp : {item.harga}</Text>
              <Text style={{ fontSize: 14 }}> X </Text>
              <Text style={{ fontSize: 14 }}>{item.qty}</Text>
            </View>
          ))}
          <Text
            style={{ fontSize: 16, fontWeight: "bold", alignSelf: "center" }}
          >
            Rp : {props.totalBayar}
          </Text>
        </View>
      </View>
  );
}
