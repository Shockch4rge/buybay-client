import { z } from "zod";

export const ProductReviewSchema = z.object({
    id: z.string(),
    product_id: z.string(),
    author_id: z.string(),
    title: z.string(),
    content: z.string(),
    rating: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
}).transform(raw => ({
    id: raw.id,
    productId: raw.product_id,
    authorId: raw.author_id,
    title: raw.title,
    content: raw.content,
    rating: raw.rating,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
}));

export type ProductReview = z.infer<typeof ProductReviewSchema>;