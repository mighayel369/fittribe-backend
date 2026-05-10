import { UserRole } from "domain/constants/user-role";

export interface ResendOtpRequestDTO {
  email: string;
  role: UserRole
}