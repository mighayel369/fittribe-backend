import { RequestLeaveDTO } from "application/dto/leave/request.leave.dto";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { randomUUID } from "crypto";
import { LEAVE_TYPES, LEAVE_STATUS } from "domain/constants/leave-status";
import { TrainerLeaveRequest, AdminLeaveRequest } from "application/dto/leave/leave-requests.dto";
import { IAdminLeaveDashboard, TrainerLeaveMetrics } from "application/dto/leave/leave-metrics.dto";
import { MAX_LEAVE_COUNT } from "utils/Constants";
import { LeaveRequestsType } from "domain/repositories/types/leave-type";
import { LeaveExportDataResponseDTO } from "application/dto/leave/leave-export-data.dto";
export const LeaveMapper = {
    toEntity(input: RequestLeaveDTO): LeaveEntity {
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return new LeaveEntity(
            randomUUID(),
            input.trainerId,
            input.type,
            start,
            end,
            days,
            input.reason,
            LEAVE_STATUS.PENDING,
        );
    },


    toTrainerLeaveMetrics(rawData: { label: string, count: number }[]): TrainerLeaveMetrics[] {
        const getCount = (type: string): number => rawData.find(d => d.label === type)?.count || 0;

        return [
            {
                label: "Sick",
                usedCount: getCount(LEAVE_TYPES.SICK_LEAVE),
                totalCount: MAX_LEAVE_COUNT.SICK
            },
            {
                label: "Casual",
                usedCount: getCount(LEAVE_TYPES.CASUAL_LEAVE),
                totalCount: MAX_LEAVE_COUNT.CASUAL
            },
            {
                label: "Medical",
                usedCount: getCount(LEAVE_TYPES.MEDICAL_LEAVE),
                totalCount: MAX_LEAVE_COUNT.MEDICAL
            },
        ];
    },
    toAdminLeaveMetrics(rawData: {
        approvalStatus: { label: string, count: number }[],
        leaveTypes: { label: string, count: number }[]
    }): IAdminLeaveDashboard {

        const totalRequestsCount = rawData.approvalStatus.reduce((acc, curr) => acc + curr.count, 0);

        return {
            approvalStatus: [
                ...rawData.approvalStatus,
                { label: 'requested', count: totalRequestsCount }
            ],
            leaveTypes: rawData.leaveTypes
        };
    },

    toExportDTO(data: LeaveRequestsType): LeaveExportDataResponseDTO {
        return {
            trainerName: data.trainer.name,
            type: data.leave.type,
            startDate: new Date(data.leave.start).toLocaleDateString('en-GB'),
            days: data.leave.days,
            status: data.leave.status
        };
    },

    toExportDTOList(records: LeaveRequestsType[]): LeaveExportDataResponseDTO[] {
        return records.map(record => this.toExportDTO(record));
    },

    toAdminLeaveRequestDTO(data: LeaveRequestsType): AdminLeaveRequest {
        return {
            leaveId: data.leave.leaveId,
            type: data.leave.type,
            startDate: new Date(data.leave.start).toISOString(),
            endDate: new Date(data.leave.end).toISOString(),
            days: data.leave.days,
            reason: data.leave.reason,
            status: data.leave.status,
            submittedAt: new Date(data.leave.createdAt ?? Date.now()).toISOString(),
            trainerId: data.trainer.trainerId,
            trainerName: data.trainer.name,
            trainerProfilePic: data.trainer.profilePic || ""
        };
    },

    toTrainerLeaveRequestDTO(data: LeaveRequestsType): TrainerLeaveRequest {
        return {
            leaveId: data.leave.leaveId,
            type: data.leave.type,
            startDate: new Date(data.leave.start).toISOString(),
            endDate: new Date(data.leave.end).toISOString(),
            days: data.leave.days,
            reason: data.leave.reason,
            status: data.leave.status,
            submittedAt: new Date(data.leave.createdAt || Date.now()).toISOString(),
            adminComment: data.leave.adminComment
        };
    }
};