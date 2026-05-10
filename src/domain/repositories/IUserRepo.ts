import { UserEntity } from "domain/entities/UserEntity";
import { IUserFilters } from "domain/filters/IUserFilters";
import { ChurnUsers } from "./types/export-type";
import { DATE_RANGES } from "utils/Constants";

export const I_USER_REPO_TOKEN = Symbol("I_USER_REPO_TOKEN");

export interface IUserRepo {
  registerUser(payload: UserEntity): Promise<UserEntity | null>;
  findAllUsers(
    page: number,
    limit: number,
    filters: IUserFilters
  ): Promise<{ data: UserEntity[]; totalCount: number }>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserById(id: string): Promise<UserEntity | null>;
  updateUserStatus(id: string, status: boolean): Promise<void>;
  updateUserData(id: string, data: UserEntity): Promise<void>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  updateResetToken(id: string, token: string | undefined, expires: number | undefined): Promise<void>;
  removeUser(id: string): Promise<boolean>;
  countUsers(): Promise<number>

  findByResetToken(token: string): Promise<UserEntity | null>
  updateUserProfilePicture(userId: string, profilePic: string): Promise<void>
  findPotentialClients(excludeIds: string[], searchQuery: string): Promise<UserEntity[]>

  getChurnUsers(range: DATE_RANGES): Promise<ChurnUsers[]>
}


