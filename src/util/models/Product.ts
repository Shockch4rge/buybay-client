import { z } from "zod";

export const ProductCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
}).transform(raw => ({
    id: raw.id,
    name: raw.name,
}));

export const ProductImageSchema = z.object({
    product_id: z.string(),
    url: z.string(),
    is_thumbnail: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
}).transform(raw => ({
    productId: raw.product_id,
    url: raw.url,
    isThumbnail: raw.is_thumbnail,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
}));

export const ProductSchema = z.object({
    id: z.string(),
    seller_id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    quantity: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    images: z.array(ProductImageSchema),
    categories: z.array(ProductCategorySchema),
}).transform(raw => ({
    id: raw.id,
    sellerId: raw.seller_id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    images: raw.images,
    quantity: raw.quantity,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    categories: raw.categories,
}));

export type Product = z.infer<typeof ProductSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;