import { z } from "zod";

export const AdminReviewListSchema =
    z.object({
        reviewId: z.string(),
        clientName: z.string(),
        clientProfilePic: z.string(),
        time: z.string(),
        trainerName: z.string(),
        program: z.string(),
        comment: z.string(),
        rating: z.number(),
        reviewStatus: z.boolean()
    });

export type AdminReviewListDTO = z.infer<typeof AdminReviewListSchema>;


export const AdminReviewListResponseSchema =
    z.object({
        reviews: z.array(AdminReviewListSchema),
        totalReviews: z.number(),
        flaggedCount: z.number(),
        newToday: z.number()
    });

export type AdminReviewListResponseDTO = z.infer<typeof AdminReviewListResponseSchema>;