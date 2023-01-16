import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../util/models/Product";
import { mockProduct1, mockProduct2 } from "../../../util/mocks";

interface CartState {
    items: Product[];
}

const initialState: CartState = {
    items: Array<Product>(10).fill(mockProduct1, 0, 6)
        .fill(mockProduct2, 6),
};

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