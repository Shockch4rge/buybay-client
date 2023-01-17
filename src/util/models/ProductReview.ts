import { z } from "zod";

export const ProductReviewSchema = z.object({
    id: z.string(),
    product_id: z.string(),
    author_id: z.string(),
    title: z.string(),
    description: z.string(),
    rating: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
}).transform(raw => ({
    id: raw.id,
    productId: raw.product_id,
    authorId: raw.author_id,
    title: raw.title,
    description: raw.description,
    rating: raw.rating,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
}));

const jsonType = ProductReviewSchema.innerType();

export type ProductReview = z.infer<typeof ProductReviewSchema>;
export type ProductReviewJSON = z.infer<typeof jsonType>;