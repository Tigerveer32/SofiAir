import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

export default function CardCartScreen({ productId, produk, harga, qty }) {
  const totalHarga = harga * qty;
  
  return(
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#CCCCCC', marginRight: 5, marginLeft: 10 }}>
      <View style={{ padding: 10, marginLeft: 5 }}>
        <Text>{productId}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 ,  marginRight:10}}>
        <Text>{produk}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <Text>Rp :{harga} X {qty}</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <Text>Rp :{totalHarga}</Text>
      </View>
    </View>
  );
}