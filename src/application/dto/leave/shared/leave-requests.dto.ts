

import {
    PaginationRequestDTO,
    PaginationRequestSchema,
} from "application/dto/common/PaginationDto";

import {
    LeaveFiltersSchema,
    ILeaveFilters
} from "domain/filters/ILeaveFilters";




export const FetchAllLeaveQuerySchema = PaginationRequestSchema(LeaveFiltersSchema)

export type fetchAllLeaveQueryDTO = PaginationRequestDTO<ILeaveFilters>