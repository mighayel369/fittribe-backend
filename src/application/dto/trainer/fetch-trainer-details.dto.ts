import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "domain/constants/language-type";
import { UserRole } from "domain/constants/user-role";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { ProgramInfoDTO } from "../programs/program-details.dto";

export interface AdminTrainerDetails {
    trainerId: string;
    name: string;
    email: string;
    role: UserRole.TRAINER;
    profilePic: string | null;
    gender: GENDER;

    experience: number;
    languages: LANGUAGE[];
    pricePerSession: number;
    programs: ProgramInfoDTO[]

    certificate: string;
    verified: TRAINER_STATUS;
    status: boolean;
    joined: string;
    rejectReason?: string;
}

export interface TrainerPrivateProfileDTO {
    trainerId: string;
    name: string;
    email: string;
    phone?: string;
    gender: GENDER;
    address: string;
    bio: string;
    profilePic: string;
    experience: number;
    languages: LANGUAGE[];
    pricePerSession: number;
    programs: ProgramInfoDTO[];
    status: boolean;
    verified: TRAINER_STATUS;
    rejectReason?: string;
    certificate: string;
    joined: string;
    rating: number;
}

export interface UserTrainerViewDTO {
    trainerId: string;
    name: string;
    profilePic: string;
    pricePerSession: number;
    experience: number;
    languages: LANGUAGE[];
    address: string;
    bio: string;
    programs: ProgramInfoDTO[];
    rating: number;
    chatId: string | null;
}