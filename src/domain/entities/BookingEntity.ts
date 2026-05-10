import { UserRole } from "domain/constants/user-role";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "domain/constants/payment-status";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";

export class BookingEntity {
  constructor(
    public bookingId: string,
    public userId: string,
    public trainerId: string,
    public program: string,
    public date: Date,
    public timeSlot: number,
    public duration: number,
    public totalAmount: number,
    public adminCommission: number,
    public trainerEarning: number,
    public status: BOOKING_STATUS,
    public payment: {
      method: PAYMENT_METHOD;
      status: PAYMENT_STATUS;
    },
    public rescheduleRequest?: {
      newDate: Date;
      newTimeSlot: number;
      requestedBy: UserRole;
      createdAt: Date;
      reason: string;
    },
    public rescheduleCount = 0,
    public rejectReason?: string,
    public meetLink?: string,
    public isReviewed = false
  ) { }

  get MAX_RESCHEDULE_LIMIT(): number {
    return 2;
  }


  private hoursUntilSession(): number {
    return (this.date.getTime() - Date.now()) / (1000 * 60 * 60);
  }

  private clearRescheduleRequest(): void {
    this.rescheduleRequest = undefined;
    this.rejectReason = undefined;
  }


  public approveReschedule(performedBy: UserRole): void {
    if (!this.rescheduleRequest) {
      throw new AppError("No active reschedule request", HttpStatus.BAD_REQUEST);
    }

    if (this.rescheduleRequest.requestedBy === performedBy) {
      throw new AppError("Cannot approve your own request", HttpStatus.FORBIDDEN);
    }

    this.date = this.rescheduleRequest.newDate;
    this.timeSlot = this.rescheduleRequest.newTimeSlot;

    if (this.rescheduleRequest.requestedBy === UserRole.USER) {
      this.rescheduleCount += 1;
    }

    this.status = BOOKING_STATUS.CONFIRMED;
    this.clearRescheduleRequest();
  }


  public rejectReschedule(
    performedBy: UserRole,
    reason?: string,
    wasPendingBefore = false
  ): void {
    if (!this.rescheduleRequest) {
      throw new AppError("No active reschedule request", HttpStatus.BAD_REQUEST);
    }

    if (this.rescheduleRequest.requestedBy === performedBy) {
      throw new AppError("Cannot reject your own request", HttpStatus.FORBIDDEN);
    }

    this.status = wasPendingBefore
      ? BOOKING_STATUS.PENDING
      : BOOKING_STATUS.CONFIRMED;

    this.rescheduleRequest = undefined;
    this.rejectReason = reason || "Rejected without reason";
  }

  public requestReschedule(
    newDate: Date,
    newTimeSlot: number,
    requestedBy: UserRole,
    reason: string
  ): void {

    if (![BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(this.status)) {
      throw new AppError(`Cannot reschedule ${this.status}`, HttpStatus.BAD_REQUEST);
    }
    if (requestedBy === UserRole.USER && this.rescheduleCount >= this.MAX_RESCHEDULE_LIMIT) {
      throw new AppError("Limit reached", HttpStatus.BAD_REQUEST);
    }

    if (this.hoursUntilSession() < 24) {
      throw new AppError("Must reschedule 24hrs before", HttpStatus.BAD_REQUEST);
    }

    this.rescheduleRequest = {
      newDate,
      newTimeSlot,
      requestedBy,
      createdAt: new Date(),
      reason
    };

    if (this.status === BOOKING_STATUS.CONFIRMED) {
      this.status = BOOKING_STATUS.RESCHEDULE_REQUESTED;
    }
  }

  public isPending(): boolean {
    return this.status === BOOKING_STATUS.PENDING;
  }

  public canBeConfirmed(): boolean {
    return this.status === BOOKING_STATUS.PENDING;
  }

  public canCancel(): boolean {
    if (![BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(this.status)) {
      return false;
    }

    const hoursDiff = this.hoursUntilSession();
    return hoursDiff >= 24;
  }

  public confirm(): void {
    if (!this.canBeConfirmed()) {
      throw new AppError(
        `Cannot confirm booking with status ${this.status}`,
        HttpStatus.BAD_REQUEST
      );
    }

    this.status = BOOKING_STATUS.CONFIRMED;
  }

  public canBeDeclined(): boolean {
    return [
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.RESCHEDULE_REQUESTED
    ].includes(this.status);
  }

  public decline(reason: string): void {
    if (!this.canBeDeclined()) {
      throw new AppError(
        `Cannot decline booking with status ${this.status}`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (!reason || reason.trim().length < 3) {
      throw new AppError("Valid decline reason required", HttpStatus.BAD_REQUEST);
    }

    this.status = BOOKING_STATUS.REJECTED;
    this.rejectReason = reason;
    this.payment.status = PAYMENT_STATUS.REFUNDED;
  }

  public cancel(): void {
    if (!this.canCancel()) {
      throw new AppError("Cancellation not allowed", HttpStatus.BAD_REQUEST);
    }

    this.status = BOOKING_STATUS.CANCELED;
  }
}