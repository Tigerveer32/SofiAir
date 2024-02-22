import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const savedProduk = async () => {
    try {
        const produk = await AsyncStorage.getItem('produkSaved');
        return produk !== null ? JSON.parse(produk) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const setProdukFunc = async (produk) => {
    console.log(produk)
    try { 
        await AsyncStorage.setItem('produkSaved', JSON.stringify(produk));
    } catch (err) {
        console.error(err);
    }
}

const initialState = {
    produkSaved: [], // Ubah menjadi array kosong, hasil dari savedProduk akan diisi nanti saat inisialisasi store
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        saveProduk(state, action) {
            const newProduk = action.payload;
            const existingIndex = state.produkSaved.findIndex(produk => produk.productId === newProduk.productId);

            if (existingIndex === -1) {
                state.produkSaved.push(newProduk);
            } else {
                state.produkSaved = state.produkSaved.filter(produk => produk.productId !== newProduk.productId);
            }
        },

        deleteProduk(state, action) {
            const productId = action.payload;
            state.produkSaved = state.produkSaved.filter(produk => produk.productId !== productId);
        }
    }
})

// Action creators
export const { saveProduk, deleteProduk } = cartSlice.actions;
export const cartActions = cartSlice.actions;
export default cartSlice.reducer;

// Fungsi middleware untuk menyimpan ke AsyncStorage
export const saveToAsyncStorage = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    setProdukFunc(state.cart.produkSaved);
    return result;
};
