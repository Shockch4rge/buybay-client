import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../util/models/Product";

interface CartState {
    items: Product[];
}

const initialState: CartState = {
    items: [],
};

interface CartAddPayload {
    product: Product;
    quantity: number;
}

interface CartRemovePayload {
    product: Product;
    quantity: number;
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartAdd: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },

        cartRemove: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex(i => i.id === action.payload.id);
            state.items.splice(index, 1);
        },
    },
});

export const {
    cartAdd,
    cartRemove,
} = cartSlice.actions;

export default cartSlice;