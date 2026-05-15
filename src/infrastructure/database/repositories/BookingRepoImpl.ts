import { injectable } from "tsyringe";
import { Expression, FilterQuery, Model } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import Booking, { IBooking } from "../models/BookingModel";
import { BookingEntity } from "domain/entities/BookingEntity";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { BookingResponseType } from "domain/repositories/types/booking-type";
import { AdminDashboardMetrics, AdminDashboardStats, TrainerPerformanceAnalytics } from "domain/repositories/types/admin-dashboard-type";
import { IBookingFilters } from "domain/filters/IBookingFilters";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";


@injectable()
export class BookingRepoImpl
    extends BaseRepository<IBooking>
    implements IBookingRepo {

    protected model: Model<IBooking> = Booking;

    private buildQuery(filters: IBookingFilters): Record<string, unknown> {
        const query: FilterQuery<IBooking> = {};

        const baseDate = filters.date ? new Date(filters.date) : new Date();
        
        const startOfToday = new Date(baseDate);
        startOfToday.setUTCHours(0, 0, 0, 0);

        const endOfToday = new Date(baseDate);
        endOfToday.setUTCHours(23, 59, 59, 999);
        if (filters.status) query.status = filters.status;
        if (filters.trainerId) query.trainerId = filters.trainerId;
        if (filters.clientId) query.userId = filters.clientId;
        if (filters.minAmount) query.totalAmount = { $gte: filters.minAmount };

        if (filters.filterType) {
            const strategy = {
                UPCOMING: { date: { $gte: startOfToday } },
                PAST: { date: { $lt: startOfToday } },
                TODAY: {
                    date: {
                        $gte: startOfToday,
                        $lte: endOfToday
                    }
                },
                ALL: {}
            };
            Object.assign(query, strategy[filters.filterType] || {});
        }

        if (filters.dateRange) {
            query.date = {
                $gte: filters.dateRange.start,
                $lte: filters.dateRange.end
            };
        }

        if (filters.search) {
            query.$or = [
                { program: { $regex: filters.search, $options: 'i' } },
                { "userInfo.name": { $regex: filters.search, $options: 'i' } }
            ];
        }

        return query;
    }


    async createBooking(payload: BookingEntity): Promise<void> {
        await this.model.create(payload)
    }

    async findBookingById(id: string): Promise<BookingEntity | null> {
        const booking = await this.model.findOne({ bookingId: id })

        return booking ? booking : null
    }

    async findAllBookings(
        filters: IBookingFilters,
        page = 1,
        limit = 5
    ): Promise<{ data: BookingResponseType[]; totalCount: number }> {
        const skip = (page - 1) * limit;

        const matchObj = this.buildQuery(filters);

        const results = await this.model.aggregate([
            { $match: matchObj },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerInfo"
                }
            },
            { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },


            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userInfo"
                }
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },

            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { date: 1, timeSlot: 1 } },
                        { $skip: skip },
                        { $limit: limit },
                        { $addFields: { user: "$userInfo", trainer: "$trainerInfo" } },
                        { $project: { userInfo: 0, trainerInfo: 0 } }
                    ]
                }
            }
        ]);

        return {
            data: results[0].data || [],
            totalCount: results[0].metadata[0]?.total || 0
        };
    }


    async findBookedSlots(trainerId: string, date: string): Promise<number[]> {
        const baseDate = new Date(date);

        const startOfDay = new Date(baseDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(baseDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const bookings = await this.model.find(
            {
                trainerId: trainerId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                status: { $nin: [BOOKING_STATUS.CANCELED, BOOKING_STATUS.REJECTED] }
            },
            { timeSlot: 1, _id: 0 }
        ).lean();

        return bookings.map((b) => b.timeSlot);
    }

    async findBookingDetails(id: string): Promise<BookingResponseType | null> {
        const result = await this.model.aggregate([
            { $match: { bookingId: id } },

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

            {
                $project: {
                    userDetails: 0,
                    trainerDetails: 0,
                    userId: 0,
                    trainerId: 0
                }
            }
        ]);
        return result.length > 0 ? result[0] : null;
    }

    async updateBooking(id: string, booking: BookingEntity): Promise<void> {
        const doc = await this.model.findOne({ bookingId: id });

        if (!doc) {
            throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        Object.assign(doc, booking);

        await doc.save();
    }



    async hasActiveBookingsForProgram(programId: string): Promise<boolean> {


        const booking = await this.model.exists({
            program: programId,
            status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] }
        });

        return !!booking;
    }

    async checkAvailability(trainerId: string, date: string, time: number): Promise<boolean> {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const existingBooking = await this.model.findOne({
            trainerId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            timeSlot: time,
            status: { $nin: [BOOKING_STATUS.CANCELED, BOOKING_STATUS.REJECTED] }
        });


        return !!existingBooking;
    }

    async updateBookingStatus(bookingId: string, status: string): Promise<void> {
        await this.model.findOneAndUpdate(
            { bookingId },
            { $set: { status: status } },
        );
    }

    async rescheduleBooking(bookingId: string, data: { newDate: Date, newTimeSlot: string }): Promise<void> {
        await this.model.findOneAndUpdate(
            { bookingId },
            {
                $set: {
                    status: BOOKING_STATUS.RESCHEDULE_REQUESTED,
                    rescheduleRequest: {
                        newDate: data.newDate,
                        newTimeSlot: data.newTimeSlot,
                        createdAt: new Date()
                    }
                }
            }
        );
    }

    async getTodayProgress(trainerId: string): Promise<{ completed: number; total: number }> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const stats = await this.model.aggregate([
            { $match: { trainer: trainerId, date: { $gte: startOfDay, $lte: endOfDay }, status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED] } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ["$status", BOOKING_STATUS.COMPLETED] }, 1, 0] } }
                }
            }
        ]);

        return stats[0] || { completed: 0, total: 0 };
    }

    async getPerformanceData(trainerId: string): Promise<{ month: string; sessionCount: number }[]> {
        return await this.model.aggregate([
            { $match: { trainerId: trainerId, status: BOOKING_STATUS.COMPLETED } },
            {
                $group: {
                    _id: { $month: "$date" },
                    sessionCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: { $arrayElemAt: [["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], "$_id"] },
                    sessionCount: 1,
                    _id: 0
                }
            }
        ]);
    }

    async getMonthlyEarnings(trainerId: string, month: number, year: number): Promise<number> {

        const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

        const result = await this.model.aggregate([
            {
                $match: {
                    trainerId: trainerId,
                    status: BOOKING_STATUS.COMPLETED,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$trainerEarning" }
                }
            }
        ]);


        return result.length > 0 ? result[0].totalEarnings : 0;
    }

    async getPendingActions(trainerId: string): Promise<BookingResponseType[]> {
        const docs = await this.model.aggregate([
            {
                $match: {
                    trainerId: trainerId,
                    status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.RESCHEDULE_REQUESTED] }
                }
            },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerInfo"
                }
            },
            { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userInfo"
                }
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },

            {
                $addFields: {
                    user: "$userInfo",
                    trainer: "$trainerInfo"
                }
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $project: {
                    userInfo: 0,
                    trainerInfo: 0
                }
            }
        ]);

        return docs;
    }

    async getUpcomingAppointmentsByDate(trainerId: string, date: Date): Promise<BookingResponseType[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const docs = await this.model.aggregate([
            {
                $match: {
                    trainerId: trainerId,
                    date: { $gte: startOfDay, $lte: endOfDay },
                    status: { $in: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CONFIRMED] }
                }
            },
            {
                $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "trainerInfo"
                }
            },
            { $unwind: "$trainerInfo" },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },

            {
                $addFields: {
                    user: "$userInfo",
                    trainer: "$trainerInfo"
                }
            },
            {
                $sort: { timeSlot: 1 }
            },
            {
                $project: {
                    userInfo: 0,
                    trainerInfo: 0
                }
            }
        ]);
        return docs;
    }

    async findUpcomingBookingCount(trainerId: string): Promise<number> {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        return await this.model.countDocuments({
            trainerId: trainerId,
            date: { $gte: startOfToday },
            status: BOOKING_STATUS.CONFIRMED
        });
    }


    async getAdminDashboardStats(): Promise<AdminDashboardStats> {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);

        const data = await this.model.aggregate([
            {
                $facet: {
                    metrics: [
                        { $group: { _id: null, totalRevenue: { $sum: { $cond: [{ $eq: ["$status", BOOKING_STATUS.COMPLETED] }, "$adminCommission", 0] } }, totalBookings: { $sum: 1 } } }
                    ],
                    performanceData: [
                        { $match: { createdAt: { $gte: sixMonthsAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%b", date: "$createdAt" } },
                                revenue: { $sum: "$adminCommission" },
                                users: { $addToSet: "$userId" },
                                monthIndex: { $first: { $month: "$createdAt" } }
                            }
                        },
                        { $sort: { monthIndex: 1 } },
                        { $project: { month: "$_id", revenue: 1, users: { $size: "$users" } } }
                    ],
                    bookingStatus: [
                        { $group: { _id: "$status", count: { $sum: 1 } } },
                        { $project: { label: "$_id", count: 1, _id: 0 } }
                    ],
                    peakHoursData: [
                        {
                            $group: {
                                _id: "$timeSlot", count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 4 }, {
                            $project: {
                                _id: 0,
                                time: "$_id",
                                count: 1
                            }
                        }
                    ]
                }
            }
        ]);

        return {
            metrics: data[0].metrics[0] || { totalRevenue: 0, totalBookings: 0 },
            performanceData: data[0].performanceData,
            bookingStatus: data[0].bookingStatus,
            peakHoursData: data[0].peakHoursData
        };
    }

    async calculateUserRetention(): Promise<string> {
        const stats = await this.model.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    repeatUsers: { $sum: { $cond: [{ $gt: ["$count", 1] }, 1, 0] } }
                }
            }
        ]);
        if (!stats.length) return "0%";
        const rate = (stats[0].repeatUsers / stats[0].totalUsers) * 100;
        return `${Math.round(rate)}%`;
    }

    async getTrainerPerformanceAnalytics(): Promise<TrainerPerformanceAnalytics[]> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentDayOfMonth = now.getDate();

        const slotsPerDay = 7;
        const totalCapacityToDate = currentDayOfMonth * slotsPerDay;

        return await this.model.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth, $lte: now },
                }
            },
            {
                $group: {
                    _id: "$trainerId",
                    bookingsCount: { $sum: 1 },
                    totalRevenue: { $sum: "$trainerEarning" }
                }
            },
            {
                $lookup: {
                    from: "trainers",
                    localField: "_id",
                    foreignField: "trainerId",
                    as: "trainerInfo"
                }
            },
            { $unwind: "$trainerInfo" },
            {
                $project: {
                    _id: 0,
                    month: { $literal: now.toLocaleString('default', { month: 'long' }) },
                    name: "$trainerInfo.name",
                    bookings: "$bookingsCount",
                    rating: { $ifNull: ["$trainerInfo.rating", 0] },
                    revenue: "$totalRevenue",
                    usage: {
                        $concat: [
                            {
                                $toString: {
                                    $round: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$bookingsCount",
                                                        { $max: [totalCapacityToDate, 1] }
                                                    ]
                                                },
                                                100
                                            ]
                                        },
                                        0
                                    ]
                                }
                            },
                            "%"
                        ]
                    }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);
    }

    async getAdminDashboardMetrics(range: '7days' | '6months' = '7days'): Promise<AdminDashboardMetrics> {
        const now = new Date();

        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        const startDate = new Date();
        let groupField: Expression;

        if (range === '7days') {
            startDate.setDate(now.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            groupField = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        } else {
            startDate.setMonth(now.getMonth() - 5);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            groupField = { $dateToString: { format: "%Y-%m", date: "$date" } };
        }

        const [data] = await this.model.aggregate([
            {
                $facet: {
                    stats: [
                        {
                            $group: {
                                _id: null,
                                totalBookings: { $sum: 1 },
                                completed: { $sum: { $cond: [{ $eq: ["$status", BOOKING_STATUS.COMPLETED] }, 1, 0] } },
                                pendingRequests: { $sum: { $cond: [{ $eq: ["$status", BOOKING_STATUS.PENDING] }, 1, 0] } },
                                todaySessions: {
                                    $sum: {
                                        $cond: [
                                            { $and: [{ $gte: ["$date", todayStart] }, { $lte: ["$date", todayEnd] }] },
                                            1, 0
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    bookingTrend: [
                        { $match: { date: { $gte: startDate } } },
                        {
                            $group: {
                                _id: groupField,
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { "_id": 1 } },
                        {
                            $project: {
                                label: "$_id",
                                bookings: "$count",
                                _id: 0
                            }
                        }
                    ],
                    statusDistribution: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                label: { $toUpper: "$_id" },
                                count: 1,
                                _id: 0
                            }
                        }
                    ]
                }
            }
        ]);

        const statsObj = data.stats[0] || { totalBookings: 0, completed: 0, pendingRequests: 0, todaySessions: 0 };
        const successRate = statsObj.totalBookings > 0
            ? ((statsObj.completed / statsObj.totalBookings) * 100).toFixed(1) + "%"
            : "0%";

        return {
            stats: {
                todaySessions: statsObj.todaySessions,
                pendingRequests: statsObj.pendingRequests,
                totalBookings: statsObj.totalBookings,
                successRate: successRate
            },
            trends: data.bookingTrend,
            distribution: data.statusDistribution
        };
    }


}