import { z } from "zod";

export const ReviewIdParamSchema =
    z.object({
        reviewId: z.string().trim().min(1)
    });

export type ReviewIdParamDTO = z.infer<typeof ReviewIdParamSchema>;