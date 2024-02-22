import React from 'react';
import { View, Text, Button } from 'react-native';

export default function CheckoutScreen({ route, navigation }) {
    const { totalPayment } = route.params;
    const handleCheckout = () => {
        navigation.navigate('Main')
    // Handle the checkout process here
    alert('Checkout complete!');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Checkout</Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Total Payment: Rp {totalPayment}</Text>
      <Button title="Complete Checkout" onPress={handleCheckout} />
    </View>
  );
};