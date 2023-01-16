import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { ProductReview, ProductReviewSchema } from "../../util/models/ProductReview";
import { Res } from "./index";
import cacheUtils from "../../util/cacheUtils";

const Tags = {
    ProductReviews: "productReviews",
};

const productReviewApi = createApi({
    reducerPath: "reviews",

    tagTypes: [...cacheUtils.defaultTags, Tags.ProductReviews],

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PRODUCT_REVIEWS_API,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState)._auth.token;

            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    endpoints: builder => ({
        getProductReviews: builder.query<ProductReview[], ProductReview["productId"]>({
            query: productId => ({
                url: `/product-reviews/${productId}`,
                method: "GET",
            }),

            transformResponse: (res: Res<{ reviews: ProductReview[] }>) =>
                Promise.all(res.reviews.map(r => ProductReviewSchema.parseAsync(r))),

            providesTags: cacheUtils.providesList(Tags.ProductReviews),
        }),

        addProductReview: builder.mutation<ProductReview, Omit<ProductReview, "createdAt" | "id" | "updatedAt">>({
            query: review => ({
                url: "/product-reviews",
                method: "POST",
                body: review,
            }),

            transformResponse: (res: Res<{ review: ProductReview }>) =>
                ProductReviewSchema.parseAsync(res.review),

            invalidatesTags: cacheUtils.invalidatesList(Tags.ProductReviews),
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useAddProductReviewMutation,
} = productReviewApi;

export default productReviewApi;