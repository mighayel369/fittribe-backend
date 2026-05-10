

import { AddReviewDTO } from "application/dto/review/add-review.dto";
import { ReviewEntity } from "domain/entities/ReviewEntity";
import { randomUUID } from "crypto";
import { ReviewsList } from "domain/repositories/types/review-type";
import { AdminReviewListDTO, ReviewListDTO } from "application/dto/review/review-list.dto";

export const ReviewMapper = {

  toEntity(data: AddReviewDTO): ReviewEntity {
    return new ReviewEntity(
      randomUUID(),
      data.trainerId,
      data.userId,
      data.bookingId,
      data.rating,
      data.comment,
      false,
    );
  },

  toAdminReviewDTO(data: ReviewsList): AdminReviewListDTO {
    const reviewData = data.reviews;
    const userData = data.reviews.user;
    const trainerData = data.reviews.trainer;
    const bookingData = data.reviews.booking
    return {
      reviewId: reviewData.reviewId,
      clientName: userData.name,
      clientProfilePic: userData.profilePic || "",
      time: reviewData.createdAt ? new Date(reviewData.createdAt).toISOString() : "N/A",
      trainerName: trainerData.name,
      program: bookingData.program,
      comment: reviewData.comment,
      rating: reviewData.rating,
      reviewStatus: reviewData.isDeleted
    };
  },



  toTrainerReviewDTO(data: ReviewsList): ReviewListDTO {
    const reviewData = data.reviews;
    const userData = data.reviews.user;

    return {
      profilePic: userData?.profilePic || "",
      name: userData?.name || "Anonymous",
      time: reviewData.createdAt
        ? new Date(reviewData.createdAt).toLocaleDateString()
        : "N/A",
      program: "General Training",
      comment: reviewData.comment,
      rating: reviewData.rating
    };
  }

};