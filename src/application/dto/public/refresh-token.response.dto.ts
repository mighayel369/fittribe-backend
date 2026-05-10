import { UserRole } from "domain/constants/user-role";

export interface RefreshTokenResponseDTO {
  accessToken?: string;
  role?: UserRole
}