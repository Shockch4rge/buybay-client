import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cacheUtils from "../../util/cacheUtils";
import { RootState } from "../store";
import { Order, OrderSchema } from "../../util/models/Order";
import { User } from "../../util/models/User";
import { Res } from "./index";

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
    }),
});

export const {
    useLazyGetUserOrdersQuery,
    useLazyGetUserSalesQuery,
} = ordersApi;

export default ordersApi;