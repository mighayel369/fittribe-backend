import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";
import { IProgramFilters } from "domain/filters/IProgramFilters";
export interface ProgramSummaryDTO {
  programId: string;
  name: string;
  description: string;
  programPic: string;
  isPublished: boolean;
}

export type FetchProgramInventoryRequestDTO = PaginationInputDTO<IProgramFilters>;

export type FetchProgramInventoryResponseDTO = PaginationOutputDTO<ProgramSummaryDTO>;

export type ExploreProgramsDTO = Omit<ProgramSummaryDTO, 'isPublished'>

export interface ExploreProgramsResponseDTO {
  data: ExploreProgramsDTO[];
}