import { LEAVE_TYPES,LEAVE_STATUS } from "utils/Constants";
import { TrainerEntity } from "./TrainerEntity";
import { AppError } from "domain/errors/AppError";
export class LeaveEntity{
    constructor(
    public leaveId: string,
    public trainer: (TrainerEntity|string),
    public type:LEAVE_TYPES,
    public start: Date,
    public end: Date,
    public days:number,
    public reason:string,
    public status: LEAVE_STATUS,
    public documents?:string,
    public adminComment?:string,
    public createdAt?:string
   ){}

   public updateStatus(newStatus: LEAVE_STATUS, comment?: string): void {
    if (this.status !== LEAVE_STATUS.PENDING) {
      throw new AppError(`Cannot update leave that is already ${this.status.toLowerCase()}`);
    }

    if (newStatus === LEAVE_STATUS.REJECTED && (!comment || comment.trim() === "")) {
      throw new AppError("A reason is required to reject a leave request.");
    }

    this.status = newStatus;
    this.adminComment = comment;
  }

  public withdraw(): void {
    if (this.status !== LEAVE_STATUS.PENDING) {
        throw new AppError(`Cannot withdraw a leave request that is already ${this.status}`);
    }
    
    this.status = LEAVE_STATUS.WITHDRAWN;
}
}