import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Product } from "../../../util/models/Product";

interface CartState {
    items: Product[];
}

const initialState: CartState = {
    items: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartAdd: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
            for (let i = 0; i < action.payload.quantity; i++) {
                state.items.push(action.payload.product);
            }
        },

        cartRemove: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex(i => i.id === action.payload.id);
            state.items.splice(index, 1);
        },

        cartClear: (state, action: PayloadAction<Product>) => {
            // remove all products in action
            state.items = state.items.filter(i => i.id !== action.payload.id);
        },
    },
});

export const {
    cartAdd,
    cartRemove,
    cartClear,
} = cartSlice.actions;

export default cartSlice;