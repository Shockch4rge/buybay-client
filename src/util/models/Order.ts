import { z } from "zod";
import { ProductSchema } from "./Product";

export const OrderSchema = z.object({
    id: z.string(),
    customer_id: z.string(),
    created_at: z.string(),
    products: z.array(ProductSchema),
}).transform(raw => ({
    id: raw.id,
    customerId: raw.customer_id,
    createdAt: raw.created_at,
    products: raw.products,
}));

export type Order = z.infer<typeof OrderSchema>;