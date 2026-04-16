import { AddReviewDTO } from "application/dto/review/add-review.dto";
import { ReviewEntity } from "domain/entities/ReviewEntity";
import { randomUUID } from "crypto";
import { AdminReviewListDTO, ReviewListDTO } from "application/dto/review/review-list.dto";

export const ReviewMapper = {
    formatRelativeTime(date?: Date): string {
        if (!date) return "Recently";

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        if (diffInSeconds < 60) return "just now";

        for (const [unit, seconds] of Object.entries(intervals)) {
            const counter = Math.floor(diffInSeconds / seconds);
            if (counter > 0) {
                return `${counter} ${unit}${counter === 1 ? "" : "s"} ago`;
            }
        }

        return date.toLocaleDateString();
    },
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

    toTrainersReviewListResponse(data: ReviewEntity): ReviewListDTO {
        return {
            profilePic: (data.userId as any)?.profilePic || "",
            name: (data.userId as any)?.name || "Anonymous",
            program: (data.bookingId as any)?.program || "General Session",
            comment: data.comment,
            rating: data.rating,
            time: this.formatRelativeTime(data.createdAt)
        };
    },

    toAdminReviewListResponseMapper(data: ReviewEntity): AdminReviewListDTO {
        const user = data.userId as any;
        const booking = data.bookingId as any;
        const trainer=data.trainerId as any
        return {
            reviewId:data.reviewId,
            clientName: user?.name || "Unknown User",
            clientProfilePic: user?.profilePic || "",
            time: this.formatRelativeTime(data.createdAt),
            trainerName: trainer?.name || "Unknown Trainer",
            program: booking?.program || "General Program",
            comment: data.comment,
            rating: data.rating,
            reviewStatus: !data.isDeleted
        };
    }
}