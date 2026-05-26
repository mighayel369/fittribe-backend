import { z } from "zod";

export const ReviewListSchema = z.object({
    profilePic: z.string(),
    name: z.string(),
    time: z.string(),
    program: z.string(),
    comment: z.string(),
    rating: z.number().min(0).max(5)
});

export type ReviewListDTO =
    z.infer<typeof ReviewListSchema>;

export const TrainerReviewsListsResponseSchema =
    z.object({
        reviews: z.array(
            ReviewListSchema
        ),
        totalReviewCount: z.number().min(0),
        rating: z.number().min(0).max(5)
    });

export type TrainerReviewsListsResponseDTO =
    z.infer<typeof TrainerReviewsListsResponseSchema>;