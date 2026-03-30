import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";

export interface ProgramSummaryDTO {
  programId: string;
  name: string;
  description: string;
  programPic: string;
  isPublished: boolean;
}

export type FetchProgramInventoryRequestDTO = PaginationInputDTO;

export type FetchProgramInventoryResponseDTO = PaginationOutputDTO<ProgramSummaryDTO>;

export interface ExploreProgramsDTO extends Omit<ProgramSummaryDTO, 'isPublished'> {}

export interface ExploreProgramsResponseDTO {
    data: ExploreProgramsDTO[];
}