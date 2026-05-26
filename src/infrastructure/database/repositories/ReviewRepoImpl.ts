import { ReviewEntity } from "domain/entities/ReviewEntity";
import ReviewModel, { IReview } from "../models/ReviewModel";
import { BaseRepository } from "./BaseRepository";
import { IReviewRepo } from "domain/repositories/IReviewRepo";
import { Model } from "mongoose";
import { injectable } from "tsyringe";
import { AppError } from "domain/errors/AppError";
import { ReviewListAggregate } from "domain/repositories/types/review-aggregate.type.ts";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class ReviewRepoImpl extends BaseRepository<IReview> implements IReviewRepo {
    protected model: Model<IReview> = ReviewModel;


    async addReview(data: ReviewEntity): Promise<void> {
        await this.model.create(data);
    }


    async getTrainerReviewsList(trainerId: string): Promise<ReviewListAggregate[]> {

        return await this.model.aggregate<ReviewListAggregate>([
            {
                $match: {
                    trainerId,
                    isDeleted: false
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "user"
                }
            },

            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "booking"
                }
            },

            {
                $unwind: {
                    path: "$booking",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainer"
                }
            },

            {
                $unwind: {
                    path: "$trainer",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    _id: 0,
                    userId: 0,
                    trainerId: 0,
                    bookingId: 0
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
    }

    async getAdminReviewsList(): Promise<ReviewListAggregate[]> {

        return await this.model.aggregate<ReviewListAggregate>([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "user"
                }
            },

            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "booking"
                }
            },

            {
                $unwind: {
                    path: "$booking",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainer"
                }
            },

            {
                $unwind: {
                    path: "$trainer",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    _id: 0,
                    userId: 0,
                    trainerId: 0,
                    bookingId: 0
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
    }

    async getReviewById(reviewId: string): Promise<ReviewEntity> {
        const doc = await this.model.findOne({ reviewId });

        if (!doc) throw new AppError(ERROR_MESSAGES.TRAINER_REVIEWS_NOT_FOUND, HttpStatus.NOT_FOUND);

        return doc;
    }

    async updateReview(data: ReviewEntity): Promise<void> {
        const result = await this.model.findOneAndUpdate(
            { reviewId: data.reviewId },
            { $set: data },
            { new: true }
        );

        if (!result) throw new AppError(ERROR_MESSAGES.TRAINER_REVIEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
}