import { injectable } from "tsyringe";
import { IUserRepo } from "domain/repositories/IUserRepo";
import UserModel, { IUser } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { UserEntity } from "domain/entities/UserEntity";
import { Model } from "mongoose";
import { DATE_RANGES, USER_STATUS_FILTERS } from "utils/Constants";
import { UserRole } from "domain/constants/user-role";
import { IUserFilters } from "domain/filters/IUserFilters";
import { FilterQuery } from "mongoose";
import { ChurnUsers } from "domain/repositories/types/export-type";
@injectable()
export class UserRepoImpl extends BaseRepository<IUser> implements IUserRepo {
    protected model: Model<IUser> = UserModel;


    private buildMatchQuery(filters: IUserFilters): FilterQuery<IUser> {
        const { search, status, ...otherFilters } = filters;

        const query: FilterQuery<IUser> = {
            ...otherFilters,
            role: UserRole.USER,
        };

        if (status === USER_STATUS_FILTERS.ACTIVE) {
            query.status = true;
        } else if (status === USER_STATUS_FILTERS.BLOCKED) {
            query.status = false;
        }

        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { name: { $regex: regex } },
                { email: { $regex: regex } }
            ];
        }

        return query;
    }


    private buildChurnQuery(range: DATE_RANGES): FilterQuery<IUser> {
        const thresholdDate = new Date();

        if (range === DATE_RANGES.ONE_MONTH) thresholdDate.setDate(thresholdDate.getDate() - 30);
        if (range === DATE_RANGES.THREE_MONTH) thresholdDate.setDate(thresholdDate.getDate() - 90);

        const query: FilterQuery<IUser> = {
            role: UserRole.USER,
            status: true
        };

        query.$or = [
            { lastBookingDate: { $lt: thresholdDate } },
            { lastBookingDate: { $exists: false } },
            { lastBookingDate: null }
        ];

        return query;
    }


    async registerUser(payload: UserEntity): Promise<UserEntity | null> {
        const doc = await this.model.create({ ...payload });
        return doc ? doc : null;
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({ email });
    }

    async findUserById(id: string): Promise<UserEntity | null> {
        return this.findOne({ userId: id, role: UserRole.USER });
    }

    async findAllUsers(
        page: number,
        limit: number,
        filters: IUserFilters
    ): Promise<{ data: UserEntity[]; totalCount: number }> {
        const skip = (page - 1) * limit;

        const matchQuery = this.buildMatchQuery(filters);

        const results = await this.model.aggregate([
            { $match: matchQuery },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const items = results[0]?.data || [];
        const total = results[0]?.totalCount[0]?.count || 0;

        return {
            data: items,
            totalCount: total
        };
    }
    async getTotalUsersCount(): Promise<number> {
        return this.model.countDocuments({ role: UserRole.USER, status: true });
    }


    async updateUserStatus(id: string, newStatus: boolean): Promise<void> {
        await this.model.findOneAndUpdate(
            { userId: id },
            { $set: { status: newStatus } }
        );
    }

    async updateUserData(id: string, data: UserEntity): Promise<void> {
        await this.model.findOneAndUpdate(
            { userId: id },
            { $set: data }
        );
    }


    async removeUser(id: string): Promise<boolean> {
        const result = await this.model.findOneAndDelete({ userId: id });
        return !!result;
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await this.model.findOneAndUpdate({ userId: id }, { password: hashedPassword });
    }

    async updateResetToken(userId: string, token?: string, expires?: number): Promise<void> {
        await this.model.findOneAndUpdate(
            { userId },
            {
                passwordResetToken: token,
                passwordResetExpires: expires
            }
        );
    }


    async findByResetToken(token: string): Promise<UserEntity | null> {
        const userDoc = await this.model.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!userDoc) {
            return null;
        }
        return userDoc;
    }

    async countUsers(): Promise<number> {
        const res = await this.model.find({ status: true, role: UserRole.USER }).countDocuments()
        return res
    }

    async getUserGrowthData(): Promise<{
        date: string;
        count: number;
    }[]> {

        return await this.model.aggregate<{
            date: string;
            count: number;
        }>([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    date: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);
    }

    async updateUserProfilePicture(userId: string, profilePic: string): Promise<void> {
        await this.model.findOneAndUpdate({ userId }, { profilePic })
    }

    async findActiveClients(): Promise<UserEntity[]> {
        const docs = await this.model.find({ status: true })
        return docs
    }


    async findPotentialClients(
        excludeIds: string[],
        searchQuery: string
    ): Promise<UserEntity[]> {
        const query: FilterQuery<IUser> = {
            userId: { $nin: excludeIds },
            role: UserRole.USER,
            status: true
        };

        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: "i" };
        }

        return await this.model.find(query);
    }

    async getChurnUsers(range: DATE_RANGES): Promise<ChurnUsers[]> {
        const query = this.buildChurnQuery(range);

        return await this.model.aggregate<ChurnUsers>([
            {
                $lookup: {
                    from: "bookings",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userBookings"
                }
            },
            {
                $addFields: {
                    lastBookingDate: { $max: "$userBookings.createdAt" }
                }
            },
            { $match: query },
            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    lastBookingDate: 1,
                    createdAt: 1,
                    _id: 0
                }
            },
            { $sort: { lastBookingDate: 1 } }
        ]);
    }
}