

import {
    PaginationRequestDTO,
    PaginationRequestSchema,
} from "application/dto/common/PaginationDto";

import {
    ProgramFiltersSchema,
    IProgramFilters
} from "domain/filters/IProgramFilters";



export const FetchProgramsQuerySchema =
    PaginationRequestSchema(
        ProgramFiltersSchema
    );

export type FetchProgramsQueryDTO = PaginationRequestDTO<IProgramFilters>;
