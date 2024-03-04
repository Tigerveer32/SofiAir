import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { handleTambahProduk } from '../../../firebase'; 
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function TambahProdukScreen ({navigation}) {
    const [product, setProduct] = useState({
      productId: '',
      harga: '',
      produk: '',
      stok: '',
    });
    const [error, setError] = useState('');

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
            // Validasi apakah nama produk sudah ada
            const produkQuery = query(collection(db, 'listProduct'), where('produk', '==', produk));
            const produkSnapshot = await getDocs(produkQuery);
            if (!produkSnapshot.empty) {
                setError('Nama produk sudah ada');
                return;
            }

            // Validasi harga dan stok harus angka
            const hargaNumber = parseFloat(harga);
            const stokNumber = parseFloat(stok);
            if (isNaN(hargaNumber) || isNaN(stokNumber)) {
                setError('Harga dan stok harus berupa angka');
                return;
            }

            // Memastikan data produk yang dikirimkan sebagai objek biasa
            const produkData = {
                productId: product.productId,
                harga: hargaNumber,
                produk: produk,
                stok: stokNumber
            };
            // Memanggil fungsi handleTambahProduk dengan data produk
            await handleTambahProduk(produkData);
            navigation.navigate('dashboard')
        } catch (error) {
            console.error("Error menambahkan product: ", error);
        }
    };

    return (
      <View style={{ flex: 2, marginTop: 50, marginLeft:10, marginRight:10 }}>
            <Text style={{ marginLeft:100, marginRight:100}}>Form Tambah Produk</Text>
            <View style={{ padding: 10, marginLeft: 5 }}>
            <Text>Nama Produk</Text>
            <TextInput
                style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
                placeholder="Masukkan Nama Produk"
                value={produk}
                onChangeText={(text) => {
                    setProduct({ ...product, produk: text });
                    setError('');
                }}
                />
                <Text>Harga</Text>
            <TextInput
                style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
                placeholder="Harga"
                value={harga}
                onChangeText={(text) => {
                    setProduct({ ...product, harga: text });
                    setError('');
                }}
                keyboardType="numeric"
                />
                <Text>Stok</Text>
            <TextInput
                style={{ height: 30, borderColor: "gray", borderWidth: 1 }}
                placeholder="Stok"
                value={stok}
                onChangeText={(text) => {
                    setProduct({ ...product, stok: text });
                    setError('');
                }}
                keyboardType="numeric"
            />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button title="Tambah produk" onPress={tambahProduk} />
            </View>
        </View>
    );
};
