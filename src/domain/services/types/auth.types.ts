import { UserRole } from "domain/constants/user-role";

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}