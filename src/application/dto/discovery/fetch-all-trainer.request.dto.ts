
import { PaginationRequestSchema, PaginationRequestDTO } from "application/dto/common/PaginationDto";
import { TrainerFiltersSchema, ITrainerFilters } from "domain/filters/ITrainerFilters";


export const FetchAllTrainersRequestSchema =
    PaginationRequestSchema(
        TrainerFiltersSchema
    );


export type FetchAllTrainersRequestDTO = PaginationRequestDTO<ITrainerFilters>