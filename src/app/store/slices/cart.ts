import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../util/models/Product";

interface CartState {
    items: Record<string, Product[]>;
}

const initialState: CartState = {
    items: {},
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
            state.items[action.payload.id].push(action.payload);
        },

        cartRemove: (state, action: PayloadAction<Product>) => {
            state.items[action.payload.id].pop();
        },
    },
});

export const {
    cartAdd,
    cartRemove,
} = cartSlice.actions;

export default cartSlice;