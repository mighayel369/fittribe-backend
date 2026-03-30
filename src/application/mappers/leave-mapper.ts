import { RequestLeaveDTO } from "application/dto/leave/request.leave.dto";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { randomUUID } from "crypto";
import { LEAVE_STATUS,LEAVE_TYPES } from "utils/Constants";
import { TrainerLeaveRequest,AdminLeaveRequest } from "application/dto/leave/leave-requests.dto";
import { IAdminLeaveDashboard, TrainerLeaveMetrics } from "application/dto/leave/leave-metrics.dto";
import { MAX_LEAVE_COUNT } from "utils/Constants";
import { TrainerEntity } from "domain/entities/TrainerEntity";

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

    toTrainerAllLeaveRequests(entity: LeaveEntity): TrainerLeaveRequest {
        return {
            leaveId: entity.leaveId,
            type: entity.type,
            startDate: entity.start.toISOString().split('T')[0],
            endDate: entity.end.toISOString().split('T')[0],
            days: entity.days,
            reason: entity.reason,
            status: entity.status,
            submittedAt: entity.createdAt || new Date().toISOString(),
            adminComment: entity.adminComment
        };
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
toAdminAllLeaveRequests(entity: LeaveEntity): AdminLeaveRequest {
    const trainer = entity.trainer as TrainerEntity;
    const isPopulated = typeof entity.trainer !== 'string';

    return {
      leaveId: entity.leaveId,
      type: entity.type,
      startDate: entity.start.toISOString(),
      endDate: entity.end.toISOString(),
      days: entity.days,
      reason: entity.reason,
      status: entity.status,
      submittedAt: entity.createdAt || new Date().toISOString(),
      
      trainerId: isPopulated ? trainer.trainerId : (entity.trainer as string),
      trainerName: isPopulated ? trainer.name : "Unknown Trainer",
      trainerProfilePic: isPopulated ? trainer.profilePic || "" : ""
    };
  }
};