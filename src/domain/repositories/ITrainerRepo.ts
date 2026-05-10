
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { TrainerType } from "./types/trainer-type";
import { ITrainerFilters } from "domain/filters/ITrainerFilters";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
export const I_TRAINER_REPO_TOKEN = Symbol("I_TRAINER_REPO_TOKEN");

export interface ITrainerRepo {
  RegisterTrainer(payload: TrainerEntity): Promise<void>;
  findTrainerById(id: string): Promise<TrainerEntity | null>;
  findTrainerDetails(trainerId: string): Promise<TrainerType | null>
  updateTrainer(id: string, payload: TrainerEntity): Promise<void>;
  updateVerificationStatus(id: string, status: TRAINER_STATUS, reason?: string): Promise<void>;
  deleteTrainer(id: string): Promise<boolean>;
  findTrainerByEmail(email: string): Promise<TrainerEntity | null>;
  findAllTrainers(page: number, limit: number, filter: ITrainerFilters): Promise<{ data: TrainerType[]; totalCount: number }>;
  updateTrainerStatus(id: string, status: boolean): Promise<void>;
  countActiveTrainers(): Promise<number>;
  updateTrainerProfilePicture(userId: string, profilePic: string): Promise<void>
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}