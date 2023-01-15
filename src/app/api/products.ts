import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Res } from "./index";
import { Product, ProductCategory, ProductCategorySchema, ProductSchema } from "../../util/models/Product";

const productsApi = createApi({
    reducerPath: "products",

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PRODUCTS_API,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState)._auth.token;

            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    endpoints: builder => ({
        getProducts: builder.query<Product[], void>({
            query: () => ({
                url: "/products",
                method: "GET",
            }),

            transformResponse: (res: Res<{ products: Product[] }>) => Promise.all(res.products.map(p => ProductSchema.parseAsync(p))),
        }),

        getProduct: builder.query<Product, void>({
            query: id => ({
                url: `/products/${id}`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),
        }),
        
        addProduct: builder.query<Product, Omit<Product, "createdAt" | "id" | "updatedAt">>({
            query: product => ({
                url: "/products",
                method: "POST",
                body: product,
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),
        }),

        deleteProduct: builder.query<void, Product["id"]>({
            query: id => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
        }),

        updateProduct: builder.query<Product, Partial<Omit<Product, "createdAt" | "updatedAt">>>({
            query: product => ({
                url: `/products/${product.id}`,
                method: "PUT",
                body: product,
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),
        }),

        getAllCategories: builder.query<ProductCategory[], void>({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),

            transformResponse: (res: Res<{ categories: ProductCategory[] }>) =>
                Promise.all(res.categories.map(c => ProductCategorySchema.parseAsync(c))),
        }),

        search: builder.query<Product[], { query: string }>({
            query: ({ query }) => ({
                url: `/search/${query}`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ products: Product[] }>) =>
                Promise.all(res.products.map(p => ProductSchema.parseAsync(p))),
        }),
    }),
});

export const {
    useGetProductQuery,
    useGetAllCategoriesQuery,
    useLazySearchQuery,
} = productsApi;

export default productsApi;