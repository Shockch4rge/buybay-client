import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    email: z.string()
        .email(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
}).transform(raw => ({
    id: raw.id,
    email: raw.email,
    name: raw.name,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
}));

export type User = z.infer<typeof UserSchema>;