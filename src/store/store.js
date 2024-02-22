import {configureStore} from '@reduxjs/toolkit';
import cartSlice from './cartSlice';

const store = configureStore({
    reducer: {
        cartSave: cartSlice,
    },
});

export default store;