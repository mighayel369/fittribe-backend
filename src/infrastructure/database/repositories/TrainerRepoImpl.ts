
import { injectable } from "tsyringe";
import TrainerModel, { ITrainer } from "../models/TrainerModel";
import { BaseRepository } from "./BaseRepository";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { UserRole } from "domain/constants/user-role";
import { TrainerProfileAggregate } from "domain/repositories/types/trainer-aggregate.type";
import { FilterQuery, PipelineStage } from "mongoose";
import { ITrainerFilters } from "domain/filters/ITrainerFilters";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerSortOptions } from "utils/Constants";
@injectable()


export class TrainerRepoImpl extends BaseRepository<ITrainer> implements ITrainerRepo {
    protected model = TrainerModel;


    private buildTrainerMatchQuery(filter: ITrainerFilters): FilterQuery<ITrainer> {

        const query: FilterQuery<ITrainer> = {
            role: UserRole.TRAINER,
            verified: filter.status
        };

        if (filter.search) {
            query.name = {
                $regex: filter.search,
                $options: "i"
            };
        }

        if (filter.gender) {
            query.gender =
                filter.gender;
        }

        if (filter.programId) {
            query.programs =
                filter.programId;
        }

        return query;
    }

    private getSortOrder(sortType?: TrainerSortOptions): Record<string, 1 | -1> {

        const sortMap:
            Record<string, Record<string, 1 | -1>> = {
            rating: {
                rating: -1
            },
            exp: {
                experience: -1
            },
            latest: {
                createdAt: -1
            }
        };
        return sortMap[
            sortType as string
        ] || {
            createdAt: -1
        };
    }

    async RegisterTrainer(payload: TrainerEntity): Promise<void> {
        await this.model.create({ ...payload });
    }
    async updateTrainerStatus(id: string, newStatus: boolean): Promise<void> {
        await this.model.findOneAndUpdate(
            { trainerId: id },
            { $set: { status: newStatus } }
        );
    }

    async findTrainerById(id: string): Promise<TrainerEntity | null> {
        const doc = await this.model.findOne({ trainerId: id })
        return doc ? doc : null
    }

    async findTrainerByEmail(email: string): Promise<TrainerEntity | null> {

        const doc = await this.model.findOne({ email })
        return doc ? doc : null
    }

    async updateTrainer(id: string, payload: TrainerEntity): Promise<void> {

        const result = await this.model.findOneAndUpdate(
            { trainerId: id },
            { $set: payload },
            { new: true }
        );

        if (!result) {
            throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }


    async updateVerificationStatus(id: string, status: TRAINER_STATUS.ACCEPTED | TRAINER_STATUS.REJECTED, reason?: string): Promise<void> {
        await this.model.findOneAndUpdate(
            { trainerId: id },
            {
                verified: status,
                rejectReason: status === TRAINER_STATUS.REJECTED ? reason : undefined
            }
        );

    }

    async deleteTrainer(id: string) {
        return this.delete(id);
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await this.model.findOneAndUpdate({ trainerId: id }, { password: hashedPassword });
    }

    async findTrainerDetails(
        trainerId: string
    ): Promise<TrainerProfileAggregate | null> {

        const docs = await this.model.aggregate<TrainerProfileAggregate>([
            { $match: { trainerId } },

            {
                $lookup: {
                    from: "programs",
                    localField: "programs",
                    foreignField: "programId",
                    as: "programs"
                }
            },

            {
                $project: {
                    _id: 0
                }
            }
        ]);

        if (!docs.length) return null;

        return docs[0]
    }

    async findAllTrainers(
        page: number,
        limit: number,
        filter: ITrainerFilters
    ): Promise<{
        data: TrainerProfileAggregate[];
        totalCount: number;
    }> {
        const skip =
            (page - 1) * limit;
        const matchQuery =
            this.buildTrainerMatchQuery(
                filter
            );
        const sortOrder =
            this.getSortOrder(
                filter.sort
            );
        const pipeline:
            PipelineStage[] = [
                {
                    $match:
                        matchQuery
                },
                {
                    $sort:
                        sortOrder
                },
                {
                    $facet: {
                        totalCount: [
                            {
                                $count: "total"
                            }
                        ],
                        docs: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            },
                            {
                                $lookup: {
                                    from: "programs",
                                    localField: "programs",
                                    foreignField: "programId",
                                    as: "programs"
                                }
                            },

                            {
                                $project: {
                                    _id: 0,
                                }
                            }
                        ]
                    }
                }
            ];

        const result = await this.model.aggregate<
            {
                totalCount: {
                    total: number;
                }[];
                docs: TrainerProfileAggregate[];
            }
        >(pipeline);

        const totalRowCount =
            result[0]
                ?.totalCount?.[0]
                ?.total || 0;

        return {
            data: result[0]?.docs || [],
            totalCount: totalRowCount
        };
    }


    async countActiveTrainers(): Promise<number> {
        const res = await this.model.find({ status: true, verified: TRAINER_STATUS.ACCEPTED }).countDocuments()
        return res
    }

    async updateTrainerProfilePicture(trainerId: string, profilePic: string): Promise<void> {
        await this.model.findOneAndUpdate({ trainerId }, { profilePic })
    }
}