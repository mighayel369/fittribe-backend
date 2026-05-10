import { ReviewEntity } from "domain/entities/ReviewEntity";
import ReviewModel, { IReview } from "../models/ReviewModel";
import { BaseRepository } from "./BaseRepository";
import { IReviewRepo } from "domain/repositories/IReviewRepo";
import { Model } from "mongoose";
import { injectable } from "tsyringe";
import { AppError } from "domain/errors/AppError";
import { ReviewsList } from "domain/repositories/types/review-type";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class ReviewRepoImpl extends BaseRepository<IReview> implements IReviewRepo {
    protected model: Model<IReview> = ReviewModel;


    async addReview(data: ReviewEntity): Promise<void> {
        await this.model.create(data);
    }

    async getTrainerReviewsList(trainerId: string): Promise<ReviewsList[]> {
        return await this.model.aggregate<ReviewsList>([
            { $match: { trainerId, isDeleted: false } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "bookingDetails"
                }
            },
            { $unwind: { path: "$bookingDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerDetails"
                }
            },
            { $unwind: { path: "$trainerDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    reviews: {
                        $mergeObjects: [
                            "$$ROOT",
                            {
                                user: "$userDetails",
                                trainer: "$trainerDetails",
                                booking: "$bookingDetails"
                            }
                        ]
                    }
                }
            },
            {
                $project: {
                    "reviews._id": 0,
                    "reviews.userId": 0,
                    "reviews.trainerId": 0,
                    "reviews.bookingId": 0,
                    "reviews.userDetails": 0,
                    "reviews.bookingDetails": 0,
                    "reviews.trainerDetails": 0
                }
            },
            { $sort: { "reviews.createdAt": -1 } }
        ]);
    }

    async getAdminReviewsList(): Promise<ReviewsList[]> {
        return await this.model.aggregate<ReviewsList>([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "bookingDetails"
                }
            },
            { $unwind: { path: "$bookingDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerDetails"
                }
            },
            { $unwind: { path: "$trainerDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    reviews: {
                        $mergeObjects: [
                            "$$ROOT",
                            {
                                user: "$userDetails",
                                trainer: "$trainerDetails",
                                booking: "$bookingDetails"
                            }
                        ]
                    }
                }
            },
            {
                $project: {
                    "reviews._id": 0,
                    "reviews.userId": 0,
                    "reviews.trainerId": 0,
                    "reviews.bookingId": 0,
                    "reviews.userDetails": 0,
                    "reviews.bookingDetails": 0,
                    "reviews.trainerDetails": 0
                }
            },
            { $sort: { "reviews.createdAt": -1 } }
        ]);
    }
    async getReviewById(reviewId: string): Promise<ReviewEntity> {
        const doc = await this.model.findOne({ reviewId });

        if (!doc) throw new AppError(ERROR_MESSAGES.TRAINER_REVIEWS_NOT_FOUND,HttpStatus.NOT_FOUND);

        return doc;
    }

    async updateReview(data: ReviewEntity): Promise<void> {
        const result = await this.model.findOneAndUpdate(
            { reviewId: data.reviewId },
            { $set: data },
            { new: true }
        );

        if (!result) throw new AppError(ERROR_MESSAGES.TRAINER_REVIEWS_NOT_FOUND,HttpStatus.NOT_FOUND);
    }
}