import { LEAVE_STATUS, LEAVE_TYPES } from "domain/constants/leave-status";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

export class LeaveEntity {
  constructor(
    public leaveId: string,
    public trainerId: string,
    public type: LEAVE_TYPES,
    public start: Date,
    public end: Date,
    public days: number,
    public reason: string,
    public status: LEAVE_STATUS,
    public documents?: string,
    public adminComment?: string,
    public createdAt?: string
  ) { }

  public updateStatus(newStatus: LEAVE_STATUS, comment?: string): void {
    if (this.status !== LEAVE_STATUS.PENDING) {
      throw new AppError(ERROR_MESSAGES.LEAVE_UPDATION_FAILED(this.status));
    }

    if (newStatus === LEAVE_STATUS.REJECTED && (!comment || comment.trim() === "")) {
      throw new AppError(ERROR_MESSAGES.REASON_REQUIRED);
    }

    this.status = newStatus;
    this.adminComment = comment;
  }

  public withdraw(): void {
    if (this.status !== LEAVE_STATUS.PENDING) {
      throw new AppError(
        ERROR_MESSAGES.SOMETHING_WENT_WRONG
      );
    }

    this.status = LEAVE_STATUS.WITHDRAWN;
  }
}