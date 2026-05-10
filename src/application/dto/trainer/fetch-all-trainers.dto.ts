import { ITrainerFilters } from "domain/filters/ITrainerFilters";
import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";
import { GENDER } from "domain/constants/gender";

export type FetchAllTrainersRequestDTO = PaginationInputDTO<ITrainerFilters>

export interface TrainersResponseDTO {
  trainerId: string;
  name: string;
  email: string;
  status: boolean;
  pricePerSession: number;
}

export type FetchAllTrainersResponseDTO = PaginationOutputDTO<TrainersResponseDTO>;

export interface ClientTrainersResponseDTO extends TrainersResponseDTO {
  profilePic: string | null;
  rating: number;
  experience: number;
  address: string | null;
  programs: string;
}

export type FetchAllClientTrainersResponseDTO = PaginationOutputDTO<ClientTrainersResponseDTO>;

export interface PendingTrainerResponseDTO extends Omit<TrainersResponseDTO, 'status' | 'email'> {
  programs: string[];
  gender: GENDER
}

export type FetchAllPendingTrainersResponseDTO = PaginationOutputDTO<PendingTrainerResponseDTO>