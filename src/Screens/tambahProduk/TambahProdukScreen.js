import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { handleTambahProduk } from '../../../firebase'; 
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function TambahProdukScreen ({navigation}) {
    const [product, setProduct] = useState({
      productId: '',
      harga: '',
      produk: '',
      stok: '',
    });
  
    const { harga, produk, stok } = product;

    useEffect(() => {
        // Membuat penghitungan jumlah produk saat ini di Firebase
        const hitungJumlahProduk = async () => {
            try {
                // Mengambil data produk dari Firebase untuk menghitung jumlah produk
                const querySnapshot = await getDocs(collection(db, 'listProduct'));
                const jumlahProduk = querySnapshot.size;
                // Menghasilkan productId baru dengan menambahkan 1 pada jumlah produk saat ini
                const newProductId = jumlahProduk + 1;
                // Mengatur productId baru ke dalam state produk
                setProduct(prevState => ({ ...prevState, productId: newProductId.toString() }));

                // Menampilkan jumlah produk yang berhasil diambil dari Firebase
                console.log("Jumlah produk: ", jumlahProduk);
            } catch (error) {
                console.error("Error fetching product data: ", error);
            }
        };

        hitungJumlahProduk();
    }, []);

    const tambahProduk = async () => {
        try {
            // Memastikan data produk yang dikirimkan sebagai objek biasa
            const produkData = {
                productId: product.productId,
                harga: harga,
                produk: produk,
                stok: stok
            };
            // Memanggil fungsi handleTambahProduk dengan data produk
            await handleTambahProduk(produkData);
            navigation.navigate('dashboard')
        } catch (error) {
            console.error("Error menambahkan product: ", error);
        }
    };

    return (
      <View style={{ flex: 2, marginTop: 30 }}>
            <Text>Form Tambah Produk</Text>
            <TextInput
                placeholder="Harga"
                value={harga}
                onChangeText={(text) => setProduct({ ...product, harga: text })}
            />
            <TextInput
                placeholder="Nama Produk"
                value={produk}
                onChangeText={(text) => setProduct({ ...product, produk: text })}
            />
            <TextInput
                placeholder="Stok"
                value={stok}
                onChangeText={(text) => setProduct({ ...product, stok: text })}
            />
            <Button title="Tambah produk" onPress={tambahProduk} />
        </View>
    );
};
