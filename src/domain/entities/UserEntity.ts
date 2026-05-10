import { UserRole } from "domain/constants/user-role";
import { GENDER } from "domain/constants/gender";

export class UserEntity {
  constructor(
    public name: string,
    public email: string,
    public userId: string,
    public role: UserRole.USER,
    public password?: string,
    public status = true,
    public createdAt?: Date,
    public gender?: GENDER,
    public age?: number,
    public googleId?: string | null,
    public phone?: string | null,
    public address?: string | null,
    public profilePic?: string | null,
    public passwordResetToken?: string,
    public passwordResetExpires?: number
  ) { }

  isBlocked(): boolean {
    return this.status === false;
  }
}
