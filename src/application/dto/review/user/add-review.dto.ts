import { z } from "zod";

export const AddReviewSchema =
    z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().trim().min(1).max(500),
        trainerId: z.string().trim().min(1),
        bookingId: z.string().trim().min(1),
    });

export type AddReviewDTO = z.infer<typeof AddReviewSchema>;