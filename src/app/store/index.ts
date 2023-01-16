import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cart";
import authApi from "../api/auth";
import productApi from "../api/products";
import authSlice from "./slices/auth";
import modalSlice from "./slices/ui/modals";
import productReviewApi from "../api/productReviews";

const uiReducer = combineReducers({
    [modalSlice.name]: modalSlice.reducer,
});

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [productReviewApi.reducerPath]: productReviewApi.reducer,
        [cartSlice.name]: cartSlice.reducer,
        [authSlice.name]: authSlice.reducer,
        ui: uiReducer,
    },
    middleware: getDM => getDM()
        .concat(authApi.middleware, productApi.middleware),
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;