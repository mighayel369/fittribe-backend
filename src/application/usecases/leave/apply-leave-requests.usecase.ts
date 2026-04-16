import { RequestLeaveDTO } from "application/dto/leave/request.leave.dto";
import { IApplyLeaveRequest } from "application/interfaces/leave/i-apply-leave-requests.usecase";
import { I_LEAVE_REPO_TOKEN, ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { inject, injectable } from "tsyringe";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { MAX_LEAVE_COUNT } from "utils/Constants";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class ApplyLeaveRequests implements IApplyLeaveRequest {
    constructor(
        @inject(I_LEAVE_REPO_TOKEN) private _leaveRepo: ILeaveRepo,
        @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly _cloudinary: ICloudinaryService
    ) { }

    async execute(input: RequestLeaveDTO): Promise<void> {
        const { startDate, trainerId, endDate, type } = input;
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const isOverlapping = await this._leaveRepo.checkOverlap(trainerId, start, end);
        if (isOverlapping) {
            throw new AppError("You already have an active or pending leave during this period.",HttpStatus.BAD_REQUEST);
        }

        const leaveEntity = LeaveMapper.toEntity(input);
        const leaveCounts = await this._leaveRepo.getTrainerLeaveCounts(trainerId);
        const currentUsage = leaveCounts.find(c => c.label === type)?.count || 0;
        const typeKey = type.toUpperCase() as keyof typeof MAX_LEAVE_COUNT
        let remainingLeaves = MAX_LEAVE_COUNT[typeKey] - currentUsage
        if (leaveEntity.days > remainingLeaves) {
            throw new AppError(
                `Leave limit exceeded for ${type}. You requested ${leaveEntity.days} days but only have ${remainingLeaves} remaining.`,
                HttpStatus.BAD_REQUEST
            );
        }
        let documentsUrl = '';
        if (input.documents) {
            documentsUrl = await this._cloudinary.getLeaveRequestDocumentsUrl(
                input.documents,
                trainerId
            );
        }
        leaveEntity.documents = documentsUrl
        await this._leaveRepo.requestLeave(leaveEntity);
    }
}