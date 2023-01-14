import { z } from "zod";

export const ResSchema = z.object({
    message: z.string(),
});

export type Res = z.infer<typeof ResSchema>;