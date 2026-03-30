import { ApplyLeaveRequestDTO } from "application/dto/leave/apply-leave.dto";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { randomUUID } from "crypto";

export const LeaveMapper={
    toEntity(input:ApplyLeaveRequestDTO):LeaveEntity{
let days = (new Date(input.endDate) - new Date(input.startDate)) / (1000 * 60 * 60 * 24) + 1       
    return new LeaveEntity(
            leaveId:randomUUID(),
            trainer:input.trainerId,
            type:input.type,
            start:input.startDate,
            end:input.endDate,
            days,

        )
    }
}