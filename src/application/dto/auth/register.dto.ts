import { UserRole } from "domain/constants/user-role";
import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "utils/Constants";
import { TRAINER_STATUS } from "domain/constants/trainer-status";

export interface RegisterResponseDTO {
  email: string;
}

export interface UserRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface TrainerRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  gender: GENDER;
  experience: number
  pricePerSession: number
  programs: string[];
  languages: LANGUAGE[];
  certificateUrl?: string
  role?: UserRole.TRAINER,
  verified?: TRAINER_STATUS
}