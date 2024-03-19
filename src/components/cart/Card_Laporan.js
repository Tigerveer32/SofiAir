import { Text, View } from "react-native";
import React from "react";

export default function CardLaporan(props) {
  const time = props.tgBayar;
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = fireBaseTime.toLocaleDateString("id-ID", options);
  const ToBay = props.totalBayar.toLocaleString();

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 5,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 12 }}>{props.index + 1}</Text>
      </View>

      <View style={{ flex: 3 }}>
        <Text style={{ fontSize: 12,marginLeft:15 }}>{date}</Text>
      </View>

      <View style={{ flex: 3 ,marginLeft:10}}>
        {props.product.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 12 }}>{item.produk} </Text>
            <Text style={{ fontSize: 12 }}> x {item.qty}</Text>
          </View>
        ))}
      </View>

      <View style={{ flex: 2,alignItems: "flex-end" }}>
        <Text style={{ fontSize: 12 }}>Rp: {ToBay}</Text>
      </View>
    </View>
  );
}
