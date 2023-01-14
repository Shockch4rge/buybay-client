import { z } from "zod";

export const ResSchema = z.object({
    message: z.string(),
});

export type Res<ExtraKeys = object> = ExtraKeys & z.infer<typeof ResSchema>;