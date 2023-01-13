import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cart";
import authApi from "../api/auth";
import productsApi from "../api/products";
import authSlice from "./slices/auth";
import modalSlice from "./slices/ui/modals";

const uiReducer = combineReducers({
    [modalSlice.name]: modalSlice.reducer,
});

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [cartSlice.name]: cartSlice.reducer,
        [authSlice.name]: authSlice.reducer,
        ui: uiReducer,
    },
    middleware: getDM => getDM()
        .concat(authApi.middleware, productsApi.middleware),
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;