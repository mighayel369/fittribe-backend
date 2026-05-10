import { UserRole } from "domain/constants/user-role";

export class OtpEntity {
  constructor(
    public email: string,
    public otp: string,
    public role: UserRole
  ) { }
}