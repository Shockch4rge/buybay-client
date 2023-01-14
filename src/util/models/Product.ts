import { z } from "zod";

export const ProductCategorySchema = z.object({
    id: z.string(),
    product_id: z.string(),
    name: z.string(),
}).transform(raw => ({
    id: raw.id,
    productId: raw.product_id,
    name: raw.name,
}));

export const ProductSchema = z.object({
    id: z.string(),
    seller_id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    thumbnail_url: z.string(),
    image_urls: z.array(z.string()),
    quantity: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    categories: z.array(ProductCategorySchema),
}).transform(raw => ({
    id: raw.id,
    sellerId: raw.seller_id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    thumbnailUrl: raw.thumbnail_url,
    imageUrls: raw.image_urls,
    quantity: raw.quantity,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    categories: raw.categories,
}));

export type Product = z.infer<typeof ProductSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;