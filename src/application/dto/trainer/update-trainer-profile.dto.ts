import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "domain/constants/language-type";

export interface UpdateTrainerProfileDTO {
  name: string;
  gender: GENDER;
  experience: number;
  languages: LANGUAGE[];
  bio: string;
  phone: string;
  address: string;
  pricePerSession: number;
  programs: string[];
}

export interface UpdateTrainerProfileRequestDTO {
  trainerId: string;
  data: UpdateTrainerProfileDTO;
}

export interface ReapplyTrainerDTO {
  name: string;
  gender: GENDER;
  experience: number;
  programs: string[];
  languages: LANGUAGE[];
  certificate: Express.Multer.File;
  pricePerSession: number
}

export interface ReapplyTrainerRequestDTO {
  trainerId: string,
  data: ReapplyTrainerDTO
}