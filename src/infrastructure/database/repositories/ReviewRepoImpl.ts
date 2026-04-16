import { ReviewEntity } from "domain/entities/ReviewEntity";
import ReviewModel, { IReview } from "../models/ReviewModel";
import { BaseRepository } from "./BaseRepository";
import { IReviewRepo } from "domain/repositories/IReviewRepo";
import { Model, Document } from "mongoose";
import { ReviewMapper } from "../mappers/ReviewMapper";
import { injectable } from "tsyringe";


@injectable()
export class ReviewRepoImpl extends BaseRepository<IReview, ReviewEntity> implements IReviewRepo {
    protected model: Model<IReview> = ReviewModel
    protected toEntity = ReviewMapper.toEntity


    async addReview(data: ReviewEntity): Promise<void> {
        await this.model.create(data)
    }

    async getTrainerReviewsList(trainerId: string): Promise<ReviewEntity[]> {
        const rawData = await this.model.aggregate([
            {
                $match: {
                    trainerId: trainerId,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userId"
                }
            },
            { $unwind: "$userId" },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "bookingId"
                }
            },
            { $unwind: "$bookingId" },
            { $sort: { createdAt: -1 } }
        ]);

        return rawData.map(doc => ReviewMapper.toEntity(doc));
    }

    async getAdminReviewsList(): Promise<ReviewEntity[]> {
        const rawData = await this.model.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userId"
                }
            },
            { $unwind: "$userId" },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "bookingId"
                }
            },
            { $unwind: "$bookingId" },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerId"
                }
            },
            { $unwind: "$trainerId" },
            { $sort: { createdAt: -1 } }
        ]);

        return rawData.map(doc => ReviewMapper.toEntity(doc));
    }

    async getReviewById(reviewId: string): Promise<ReviewEntity> {
        const result = await this.model.aggregate([
            { $match: { reviewId: reviewId } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userDetails"
                }
            },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$trainerDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    user: "$userDetails",
                    trainer: "$trainerDetails"
                }
            },
            { $project: { userDetails: 0, trainerDetails: 0 } }
        ]);

        if (!result || result.length === 0) {
            throw new Error("Review not found");
        }

        return ReviewMapper.toEntity(result[0]);
    }

    async updateReview(data: ReviewEntity): Promise<void> {
        const persistenceData = ReviewMapper.toPersistence(data);

        const result = await this.model.findOneAndUpdate(
            { reviewId: data.reviewId },
            { $set: persistenceData },
            { new: true }
        );

        if (!result) {
            throw new Error("Failed to update review: Review not found");
        }
    }
}