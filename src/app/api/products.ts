import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Res } from "./index";
import { Product, ProductCategory, ProductCategorySchema, ProductSchema } from "../../util/models/Product";
import cacheUtils from "../../util/cacheUtils";

const Tag = {
    Products: "Product",
    Categories: "ProductCategory",
};

const productsApi = createApi({
    reducerPath: "products",
    tagTypes: [...cacheUtils.defaultTags, Tag.Products, Tag.Categories],

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

            providesTags: cacheUtils.providesList(Tag.Products),
        }),

        getProduct: builder.query<Product, Product["id"]>({
            query: id => ({
                url: `/products/${id}`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),

            providesTags: cacheUtils.cacheByIdArg(Tag.Products),
        }),
        
        addProduct: builder.mutation<Product, Omit<Product, "createdAt" | "id" | "updatedAt">>({
            query: product => ({
                url: "/products",
                method: "POST",
                body: product,
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),

            invalidatesTags: cacheUtils.invalidatesList(Tag.Products),
        }),

        deleteProduct: builder.mutation<void, Product["id"]>({
            query: id => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: cacheUtils.invalidatesList(Tag.Products),
        }),

        updateProduct: builder.mutation<Product, Partial<Omit<Product, "createdAt" | "updatedAt">>>({
            query: product => ({
                url: `/products/${product.id}`,
                method: "PUT",
                body: product,
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),

            invalidatesTags: cacheUtils.invalidatesList(Tag.Products),
        }),

        getAllCategories: builder.query<ProductCategory[], void>({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),

            transformResponse: (res: Res<{ categories: ProductCategory[] }>) =>
                Promise.all(res.categories.map(c => ProductCategorySchema.parseAsync(c))),

            providesTags: cacheUtils.providesList(Tag.Categories),
        }),

        search: builder.query<{ products: Product[]; categories: ProductCategory[] }, { query: string }>({
            query: ({ query }) => ({
                url: `/products/search/${query}`,
                method: "GET",
            }),

            transformResponse: async (res: Res<{ products: Product[]; categories: ProductCategory[] }>) => {
                const { products, categories } = res;

                return {
                    products: await Promise.all(products.map(p => ProductSchema.parseAsync(p))),
                    categories: await Promise.all(categories.map(c => ProductCategorySchema.parseAsync(c))),
                };
            },
        }),

        getProductsByCategory: builder.query<Product[], ProductCategory["id"]>({
            query: categoryId => ({
                url: `/categories/${categoryId}/products`,
                method: "GET",
            }),
    
            transformResponse: (res: Res<{ products: Product[] }>) => Promise.all(res.products.map(p => ProductSchema.parseAsync(p))),

            providesTags: cacheUtils.providesList(Tag.Products),
        }),
    }),
});

export const {
    useGetProductQuery,
    useGetAllCategoriesQuery,
    useLazySearchQuery,
    useLazyGetProductsByCategoryQuery,
} = productsApi;

export default productsApi;