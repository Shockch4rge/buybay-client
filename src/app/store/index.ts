import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cart";
import authApi from "../api/auth";
import productsApi from "../api/products";
import authSlice from "./slices/auth";
import modalSlice from "./slices/ui/modals";

const uiReducer = combineReducers({
    [modalSlice.name]: modalSlice.reducer,
});

const sliceReducer = combineReducers({
    [cartSlice.name]: cartSlice.reducer,
    [authSlice.name]: authSlice.reducer,
});

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        ui: uiReducer,
        slices: sliceReducer,
    },
    middleware: getDM => getDM()
        .concat(authApi.middleware, productsApi.middleware),
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;