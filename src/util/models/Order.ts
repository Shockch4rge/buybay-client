import { z } from "zod";

export const OrderSchema = z.object({
    id: z.string(),
    product_id: z.string(),
    seller_id: z.string(),
    buyer_id: z.string(),
    created_at: z.string(),
    product_quantity: z.number(),
}).transform(raw => ({
    id: raw.id,
    productId: raw.product_id,
    sellerId: raw.seller_id,
    buyerId: raw.buyer_id,
    createdAt: raw.created_at,
    productQuantity: raw.product_quantity,
}));

export type Order = z.infer<typeof OrderSchema>;