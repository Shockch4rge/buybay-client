import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Res } from "./index";
import { Product, ProductCategory, ProductCategorySchema, ProductSchema } from "../../util/models/Product";
import cacheUtils from "../../util/cacheUtils";
import { User } from "../../util/models/User";

const Tag = {
    Products: "Product",
    Categories: "ProductCategory",
};

type SearchQueryBody = {
    query: string;
    limit?: number;
} & ({
    includeProducts?: false;
    includeCategories?: true;
} | {
    includeProducts?: true;
    includeCategories?: false;
} | {
    includeProducts?: true;
    includeCategories?: true;
});

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
        getAllProducts: builder.query<Product[], void>({
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
        
        addProduct: builder.mutation<Product, FormData>({
            query: form => ({
                url: "/products",
                method: "POST",
                body: form,
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

        updateProduct: builder.mutation<Product, Pick<Product, "id"> & { data: FormData }>({
            query: ({ id, data }) => ({
                url: `/products/${id}?_method=PUT`,
                method: "POST",
                body: data,
            }),

            transformResponse: (res: Res<{ product: Product }>) => ProductSchema.parseAsync(res.product),

            invalidatesTags: cacheUtils.invalidatesList(Tag.Products),
        }),

        getAllCategories: builder.query<ProductCategory[], { limit?: number }>({
            query: ({ limit }) => ({
                url: limit ? `/categories?limit=${limit}` : `/categories`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ categories: ProductCategory[] }>) =>
                Promise.all(res.categories.map(c => ProductCategorySchema.parseAsync(c))),

            providesTags: cacheUtils.providesList(Tag.Categories),
        }),

        search: builder.query<{ products: Product[]; categories: ProductCategory[] }, SearchQueryBody>({
            query: ({ query, includeProducts = true, includeCategories = true, limit }) => ({
                url: `/products/search/${query}/${includeProducts}/${includeCategories}/${limit ?? ""}`,
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

        getCategoryProducts: builder.query<Product[], { limit?: number; categoryIds: Array<ProductCategory["id"]> }>({
            query: ({ limit, categoryIds }) => ({
                url: `/categories/products`,
                method: "POST",
                body: {
                    limit,
                    categories: categoryIds,
                },
            }),
    
            transformResponse: (res: Res<{ categories: Array<ProductCategory["id"]>; products: Product[] }>) =>
                Promise.all(res.products.map(p => ProductSchema.parseAsync(p))),

            providesTags: cacheUtils.providesList(Tag.Products),
        }),

        addProductCategories: builder.mutation<ProductCategory[], Array<Pick<ProductCategory, "name">>>({
            query: body => ({
                url: `/categories`,
                method: "POST",
                body,
            }),

            transformResponse: (res: Res<{ categories: ProductCategory[] }>) =>
                Promise.all(res.categories.map(c => ProductCategorySchema.parseAsync(c))),

            invalidatesTags: cacheUtils.invalidatesList(Tag.Categories),
        }),

        getUserProducts: builder.query<Product[], User["id"]>({
            query: id => ({
                url: `/user/${id}/products`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ products: Product[] }>) =>
                Promise.all(res.products.map(p => ProductSchema.parseAsync(p))),

            providesTags: cacheUtils.providesList(Tag.Products),
        }),
    }),
});

export const {
    useGetUserProductsQuery,
    useGetAllProductsQuery,
    useGetProductQuery,
    useLazyGetProductQuery,
    useGetAllCategoriesQuery,
    useLazySearchQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useAddProductCategoriesMutation,
    useLazyGetCategoryProductsQuery,
} = productsApi;

export default productsApi;