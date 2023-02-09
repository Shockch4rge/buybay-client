import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cacheUtils from "../../util/cacheUtils";
import { RootState } from "../store";
import { Order, OrderSchema } from "../../util/models/Order";
import { User } from "../../util/models/User";
import { Res } from "./index";
import { ProductJSON } from "../../util/models/Product";

const Tags = {
    Orders: "Orders",
};

const ordersApi = createApi({
    reducerPath: "orders",

    tagTypes: [...cacheUtils.defaultTags, Tags.Orders],

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_ORDERS_API,

        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState)._auth.token;
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: builder => ({
        getOrders: builder.query({
            query: () => ({
                url: "/orders",
                method: "GET",
            }),
        }),

        getOrder: builder.query<Order, Order["id"]>({
            query: id => ({
                url: `/order/${id}`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ order: Order }>) => OrderSchema.parseAsync(res.order),

            providesTags: cacheUtils.cacheByIdArg(Tags.Orders),
        }),

        getUserOrders: builder.query<Order[], User["id"]>({
            query: id => ({
                url: `/user/${id}/orders`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ orders: Order[] }>) =>
                Promise.all(res.orders.map(o => OrderSchema.parseAsync(o))),

            providesTags: cacheUtils.invalidatesList(Tags.Orders),
        }),

        getUserSales: builder.query<Order[], User["id"]>({
            query: id => ({
                url: `/user/${id}/sales`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ orders: Order[] }>) =>
                Promise.all(res.orders.map(o => OrderSchema.parseAsync(o))),

            providesTags: cacheUtils.invalidatesList(Tags.Orders),
        }),

        checkout: builder.mutation<{ order: Order; url: string }, { buyer_id: User["id"]; products: Array<ProductJSON & { purchased_quantity: number }> }>({
            query: body => ({
                url: "/checkout",
                method: "POST",
                body,
            }),

            transformResponse: async (res: Res<{ order: Order; url: string }>) => ({
                order: await OrderSchema.parseAsync(res.order),
                url: res.url,
            }),

            invalidatesTags: cacheUtils.invalidatesList(Tags.Orders),
        }),
    }),
});

export const {
    useGetOrderQuery,
    useLazyGetUserOrdersQuery,
    useLazyGetUserSalesQuery,
    useCheckoutMutation,
} = ordersApi;

export default ordersApi;