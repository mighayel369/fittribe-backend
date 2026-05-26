
import { AddReviewDTO } from "application/dto/review/user/add-review.dto";
import { ReviewEntity } from "domain/entities/ReviewEntity";
import { randomUUID } from "crypto";
import { ReviewListAggregate } from "domain/repositories/types/review-aggregate.type.ts";
import { TrainerReviewsListsResponseDTO, TrainerReviewsListsResponseSchema } from "application/dto/review/trainer/review-list.dto";
import { ReviewListDTO, ReviewListSchema } from "application/dto/review/trainer/review-list.dto";
import { AdminReviewListDTO } from "application/dto/review/admin/review-list.dto";
export const ReviewMapper = {

  toEntity(data: AddReviewDTO,userId:string): ReviewEntity {
    return new ReviewEntity(
      randomUUID(),
      data.trainerId,
      userId,
      data.bookingId,
      data.rating,
      data.comment,
      false,
    );
  },

  toAdminReviewDTO(data: ReviewListAggregate): AdminReviewListDTO {

    return {
      reviewId: data.reviewId,
      clientName: data.user?.name || "Unknown",
      clientProfilePic: data.user?.profilePic || "",
      time: data.createdAt ? new Date(data.createdAt).toISOString() : "N/A",
      trainerName: data.trainer?.name || "Unknown",
      program: data.booking?.program || "General",
      comment: data.comment,
      rating: data.rating,
      reviewStatus: data.isDeleted
    };
  },

  toTrainerReviewDTO(data: ReviewListAggregate): ReviewListDTO {

    return ReviewListSchema.parse({
      profilePic: data.user?.profilePic || "",
      name: data.user?.name || "Anonymous",
      time: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A",
      program: data.booking?.program || "General Training",
      comment: data.comment,
      rating: data.rating
    });
  },

  toTrainerReviewListResponse(reviews: ReviewListAggregate[], totalReviewCount: number, rating: number): TrainerReviewsListsResponseDTO {

    return TrainerReviewsListsResponseSchema.parse({
      reviews: reviews.map(review =>
        this.toTrainerReviewDTO(review)
      ),
      totalReviewCount,
      rating
    });
  }
};