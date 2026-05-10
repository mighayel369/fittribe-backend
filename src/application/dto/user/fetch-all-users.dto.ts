import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";
import { IUserFilters } from "domain/filters/IUserFilters";
export type FetchAllUsersRequestDTO = PaginationInputDTO<IUserFilters>

export interface UserResponseDTO {
  userId: string;
  name: string;
  email: string;
  status: boolean;
}


export type FetchAllUsersResponseDTO = PaginationOutputDTO<UserResponseDTO>;