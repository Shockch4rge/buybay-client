import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    email: z.string()
        .email(),
    name: z.string(),
    avatar_url: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
}).transform(raw => ({
    id: raw.id,
    email: raw.email,
    name: raw.name,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    avatarUrl: raw.avatar_url,
}));

export type User = z.infer<typeof UserSchema>;

const jsonType = UserSchema.innerType();
export type UserJSON = z.infer<typeof jsonType>;