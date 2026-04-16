import { BOOKING_STATUS, UserRole } from "utils/Constants";
import { TrainerEntity } from "./TrainerEntity";
import { UserEntity } from "./UserEntity";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { timeToMin } from "utils/generateTimeSlots";
export class BookingEntity {
  private MAX_RESCHEDULE_LIMIT=2
  constructor(
    public  bookingId: string,
    public  user: (UserEntity|string),
    public  trainer: (TrainerEntity|string),
    public  program:string,

    public  date: Date,
    public  timeSlot: number,
    public  duration: number,

    public totalAmount: number,
    public adminCommission: number,
    public trainerEarning: number,

    public  status: BOOKING_STATUS,

    public payment: {
      method: "wallet" | "online";
      status: "hold" | "paid" | "refunded";
    },
    public  rescheduleRequest?: {
      newDate: Date;
      newTimeSlot: number;
      requestedBy:UserRole,
      createdAt: Date;
    },
    public readonly rescheduleCount?:number,
    public rejectReason?:string,
    public meetLink?:string,
    public isReviewed?:boolean
  ) {}

  public get trainerId(): string {
    if (typeof this.trainer === 'string') {
      return this.trainer;
    }
    return this.trainer.trainerId;
  }

  public get userId(): string {
  if (typeof this.user === 'string') {
    return this.user;
  }
  return this.user.userId;
}

  public canBeConfirmed(): boolean {
    return this.status === BOOKING_STATUS.PENDING;
  }

  public canBeDeclined(): boolean {
  return this.status === BOOKING_STATUS.PENDING || this.status === BOOKING_STATUS.CONFIRMED || this.status===BOOKING_STATUS.RESCHEDULE_REQUESTED;
}

  public canCancel(): boolean {
    const MIN_CANCEL_HOURS = 24;
    const now = new Date();
    const sessionTime = new Date(this.date);
   
    if (this.status !== BOOKING_STATUS.CONFIRMED && this.status !== BOOKING_STATUS.PENDING) return false;
    const hoursDifference = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= MIN_CANCEL_HOURS;
}
public requestReschedule(newDate: Date, newTimeSlot: string, requestedBy: UserRole): void {
    const now = new Date();
    const sessionDate = new Date(this.date);


    if (this.status !== BOOKING_STATUS.PENDING && this.status !== BOOKING_STATUS.CONFIRMED) {
      throw new AppError(`Cannot reschedule a ${this.status} booking.`, HttpStatus.BAD_REQUEST);
    }

    if (requestedBy === UserRole.USER && (this.rescheduleCount || 0) >= this.MAX_RESCHEDULE_LIMIT) {
      throw new AppError("Maximum reschedule limit reached.", HttpStatus.BAD_REQUEST);
    }

    const hoursUntil = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntil < 24) {
      throw new AppError("Must reschedule at least 24 hours in advance.", HttpStatus.BAD_REQUEST);
    }

    this.rescheduleRequest = {
      newDate,
      newTimeSlot: timeToMin(newTimeSlot),
      requestedBy,
      createdAt: new Date()
    };

    if (this.status === BOOKING_STATUS.CONFIRMED) {
      this.status = BOOKING_STATUS.RESCHEDULE_REQUESTED;
    }
  }

  public approveReschedule(performedBy: UserRole): void {
    if (!this.rescheduleRequest) throw new AppError('No active request.', HttpStatus.BAD_REQUEST);
    if (this.rescheduleRequest.requestedBy === performedBy) {
      throw new AppError('Cannot approve your own request.', HttpStatus.FORBIDDEN);
    }

    this.date = this.rescheduleRequest.newDate;
    this.timeSlot = this.rescheduleRequest.newTimeSlot;
    
    if (this.rescheduleRequest.requestedBy === UserRole.USER) {
        (this as any).rescheduleCount = (this.rescheduleCount || 0) + 1;
    }

    this.status = BOOKING_STATUS.CONFIRMED;
    this.rescheduleRequest = undefined;
  }

  public rejectReschedule(performedBy: UserRole, reason?: string, wasPendingBefore: boolean = false): void {
    if (!this.rescheduleRequest) throw new AppError('No active request.', HttpStatus.BAD_REQUEST);
    
    
    this.status = wasPendingBefore ? BOOKING_STATUS.PENDING : BOOKING_STATUS.CONFIRMED;
    
    this.rescheduleRequest = undefined; 
    this.rejectReason = reason || "Declined without a specific reason.";
  }

  public decline(reason: string): void {
  if (!this.canBeDeclined()) {
    throw new AppError(ERROR_MESSAGES.DECLINE_BOOKING_ERROR, HttpStatus.BAD_REQUEST);
  }

  (this as any).status = BOOKING_STATUS.REJECTED; 
  this.rejectReason = reason;
  this.payment.status = "refunded";
}
}

 



