import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productsApi = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PRODUCTS_API,
    }),
    endpoints: builder => ({
        getProducts: builder.query<void, void>({
            query: () => ({
                url: "/products",
                method: "GET",
            }),
        }),
    }),
});

export default productsApi;