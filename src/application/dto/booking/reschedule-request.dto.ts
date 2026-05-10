export interface RescheduleRequestDTO {
  bookingId: string;
  newDate: Date;
  newTimeSlot: number;
  reason: string;
  trainerId: string
}