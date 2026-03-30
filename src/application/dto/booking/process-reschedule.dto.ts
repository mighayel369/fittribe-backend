import { UserRole } from "utils/Constants";

export interface ProcessRescheduleRequestDTO {
  bookingId: string;
  performedBy: UserRole
  reason?:string
}