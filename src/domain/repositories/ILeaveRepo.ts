import { LeaveEntity } from "domain/entities/LeaveEntity";
import { LeaveRequestsType } from "./types/leave-type";
import { ILeaveFilters } from "domain/filters/ILeaveFilters";

export const I_LEAVE_REPO_TOKEN = Symbol("I_LEAVE_REPO_TOKEN");

export interface ILeaveRepo {
    getAllLeaveRequests(filter?: ILeaveFilters, page?: number, limit?: number): Promise<{ data: LeaveRequestsType[]; totalCount: number }>
    requestLeave(data: LeaveEntity): Promise<void>,
    getTrainerLeaveCounts(trainerId: string): Promise<{ label: string, count: number }[]>,
    isTrainerOnLeave(trainerId: string, date: string): Promise<boolean>
    getAllLeaveCount(): Promise<{ approvalStatus: { label: string, count: number }[], leaveTypes: { label: string, count: number }[] }>
    updateLeaveData(data: LeaveEntity): Promise<void>
    getLeaveById(leaveId: string): Promise<LeaveEntity | null>
    checkOverlap(trainerId: string, start: Date, end: Date): Promise<boolean>;
    findLeaveReport(): Promise<LeaveRequestsType[]>
}