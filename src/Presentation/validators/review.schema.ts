import { z } from 'zod';
export const reviewIdSchema = z.object({
  reviewId: z.string().min(1,"Invalid review ID format")
});


export const addReviewSchema = z.object({
  rating: z.coerce.number().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  comment: z.string().min(3, "Comment is too short").max(500, "Comment is too long"),
  trainerId: z.string().min(1,"Invalid trainer ID"),
  bookingId: z.string().min(1,"Invalid booking ID"),
});