import { z } from "zod";

export const OrderSchema = z.object({
    id: z.string(),
    product_id: z.string(),
    buyer_id: z.string(),
    created_at: z.string(),
}).transform(raw => ({
    id: raw.id,
    productId: raw.product_id,
    buyerId: raw.buyer_id,
    createdAt: raw.created_at,
}));

export type Order = z.infer<typeof OrderSchema>;