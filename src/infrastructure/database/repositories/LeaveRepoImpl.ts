
import { injectable } from "tsyringe";
import Leave, { ILeave } from "../models/LeaveModel";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { BaseRepository } from "./BaseRepository";
import { LEAVE_STATUS } from "domain/constants/leave-status";
import { LeaveRequestsType } from "domain/repositories/types/leave-type";
import { FilterQuery, PipelineStage } from "mongoose";
import { ILeaveFilters } from "domain/filters/ILeaveFilters";



@injectable()
export class LeaveRepository extends BaseRepository<ILeave> implements ILeaveRepo {
    protected model = Leave;

    private buildMatchQuery(filters: ILeaveFilters): FilterQuery<ILeave> {
        const query: FilterQuery<ILeave> = {};

        if (filters.trainerId) {
            query.trainerId = filters.trainerId;
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.search) {
            const regex = new RegExp(filters.search, "i");
            query.$or = [
                { type: { $regex: regex } },
                { reason: { $regex: regex } }
            ];
        }

        return query;
    }

    async getAllLeaveRequests(
        filters: ILeaveFilters,
        page: number,
        limit: number
    ): Promise<{ data: LeaveRequestsType[]; totalCount: number }> {
        const skip = (page - 1) * limit;

        const initialMatch = this.buildMatchQuery(filters);

        const pipeline: PipelineStage[] = [
            { $match: initialMatch },
            {
                $lookup: {
                    from: 'trainers',
                    localField: 'trainerId',
                    foreignField: 'trainerId',
                    as: "trainerDetails"
                }
            },
            { $unwind: "$trainerDetails" },
            ...(filters.search ? [{
                $match: {
                    "trainerDetails.name": { $regex: new RegExp(filters.search, "i") }
                }
            }] : []),
            { $sort: { "leave.createdAt": -1 } }
        ];

        const countPipeline = [...pipeline, { $count: "total" }];
        const countRes = await this.model.aggregate(countPipeline);
        const totalCount = countRes.length > 0 ? countRes[0].total : 0;


        pipeline.push(
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    leave: {
                        leaveId: "$leaveId",
                        type: "$type",
                        start: "$start",
                        end: "$end",
                        days: "$days",
                        reason: "$reason",
                        status: "$status",
                        documents: "$documents",
                        adminComment: "$adminComment",
                        createdAt: "$createdAt"
                    },
                    trainer: {
                        trainerId: "$trainerDetails.trainerId",
                        name: "$trainerDetails.name",
                        email: "$trainerDetails.email",
                        role: "$trainerDetails.role",
                        profilePic: "$trainerDetails.profilePic",
                        experience: "$trainerDetails.experience",
                        rating: "$trainerDetails.rating"
                    }
                }
            }
        );

        const docs = await this.model.aggregate<LeaveRequestsType>(pipeline);

        return {
            data: docs,
            totalCount
        };
    }

    async requestLeave(data: LeaveEntity): Promise<void> {
        await this.model.create(data)
    }

    async getTrainerLeaveCounts(trainerId: string): Promise<{ label: string, count: number }[]> {
        const currentYear = new Date().getFullYear();

        const startOfYear = new Date(currentYear, 0, 1);

        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

        const counts = await this.model.aggregate([
            {
                $match: {
                    trainer: trainerId,
                    status: { $in: [LEAVE_STATUS.APPROVED, LEAVE_STATUS.PENDING] },
                    start: {
                        $gte: startOfYear,
                        $lte: endOfYear
                    }
                }
            },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: "$days" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    count: 1
                }
            }
        ]);

        return counts;
    }

    async isTrainerOnLeave(trainerId: string, date: string): Promise<boolean> {
        const baseDate = new Date(date);

        const startOfSelectedDate = new Date(baseDate);
        startOfSelectedDate.setUTCHours(0, 0, 0, 0);

        const endOfSelectedDate = new Date(baseDate);
        endOfSelectedDate.setUTCHours(23, 59, 59, 999);

        const activeLeave = await this.model.findOne({
            trainer: trainerId,
            status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] },
            start: { $lte: endOfSelectedDate.toISOString() },
            end: { $gte: startOfSelectedDate.toISOString() }
        });

        return !!activeLeave;
    }

    async getAllLeaveCount(): Promise<{ approvalStatus: { label: string, count: number }[], leaveTypes: { label: string, count: number }[] }> {
        const [result] = await this.model.aggregate([
            {
                $facet: {
                    approvalStatus: [
                        { $group: { _id: "$status", count: { $sum: 1 } } },
                        { $project: { _id: 0, label: "$_id", count: 1 } }
                    ],
                    leaveTypes: [
                        { $match: { status: LEAVE_STATUS.APPROVED } },
                        { $group: { _id: "$type", count: { $sum: "$days" } } },
                        { $project: { _id: 0, label: "$_id", count: 1 } }
                    ]
                }
            }
        ]);

        return {
            approvalStatus: result.approvalStatus || [],
            leaveTypes: result.leaveTypes || []
        };
    }

    async updateLeaveData(data: LeaveEntity): Promise<void> {

        await this.model.findOneAndUpdate(
            { leaveId: data.leaveId },
            { $set: data }
        );
    }


    async getLeaveById(leaveId: string): Promise<LeaveEntity | null> {
        const doc = await this.model.findOne({ leaveId });
        return doc ? doc : null;
    }

    async checkOverlap(trainerId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const conflict = await this.model.findOne({
            trainer: trainerId,
            status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] },
            start: { $lte: endDate },
            end: { $gte: startDate }
        });

        return !!conflict;
    }

    async findLeaveReport(): Promise<LeaveRequestsType[]> {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        return await this.model.aggregate<LeaveRequestsType>([
            {
                $match: {
                    start: { $gte: startDate, $lte: endDate }
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
            { $unwind: "$trainerDetails" },
            {
                $project: {
                    _id: 0,
                    leave: {
                        leaveId: "$leaveId",
                        type: "$type",
                        start: "$start",
                        end: "$end",
                        days: "$days",
                        reason: "$reason",
                        status: "$status",
                        documents: "$documents",
                        adminComment: "$adminComment",
                        createdAt: "$createdAt"
                    },
                    trainer: {
                        trainerId: "$trainerDetails.trainerId",
                        name: "$trainerDetails.name",
                        email: "$trainerDetails.email",
                        role: "$trainerDetails.role",
                        profilePic: "$trainerDetails.profilePic",
                        rating: "$trainerDetails.rating",
                        status: "$trainerDetails.status"
                    }
                }
            },
            { $sort: { "leave.start": 1 } }
        ]);
    }
}