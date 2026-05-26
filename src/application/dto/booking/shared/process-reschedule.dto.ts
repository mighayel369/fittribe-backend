import { UserRole } from "domain/constants/user-role";

export interface ProcessRescheduleRequestDTO {
  bookingId: string;
  performedBy: UserRole
  reason?: string
}