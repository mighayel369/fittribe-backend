import { inject, injectable } from "tsyringe";
import { RequestLeaveDTO } from "application/dto/leave/request.leave.dto";
import { IApplyLeaveRequest } from "application/interfaces/leave/i-apply-leave-requests.usecase";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { MAX_LEAVE_COUNT } from "utils/Constants";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ApplyLeaveRequests implements IApplyLeaveRequest {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo,

    @inject(I_CLOUDINARY_SERVICE_TOKEN)
    private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(requestPayload: RequestLeaveDTO): Promise<void> {
    const { startDate, trainerId, endDate, type } = requestPayload;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const isOverlapping = await this._leaveRepository.checkOverlap(trainerId, start, end);
    if (isOverlapping) {
      throw new AppError(
      ERROR_MESSAGES.LEAVE_ALREADY_EXISTED,
        HttpStatus.BAD_REQUEST
      );
    }

    const leaveEntity = LeaveMapper.toEntity(requestPayload);
    const leaveCounts = await this._leaveRepository.getTrainerLeaveCounts(trainerId);

    const currentUsage = leaveCounts.find(c => c.label === type)?.count || 0;
    const typeKey = type.toUpperCase() as keyof typeof MAX_LEAVE_COUNT;
    const remainingLeaves = MAX_LEAVE_COUNT[typeKey] - currentUsage;

    if (leaveEntity.days > remainingLeaves) {
      throw new AppError(
        `Leave limit exceeded for ${type}. Requested: ${leaveEntity.days} days, Available: ${remainingLeaves} days.`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (requestPayload.documents) {
      leaveEntity.documents = await this._cloudinaryService.getLeaveRequestDocumentsUrl(
        requestPayload.documents,
        trainerId
      );
    }

    await this._leaveRepository.requestLeave(leaveEntity);
  }
}