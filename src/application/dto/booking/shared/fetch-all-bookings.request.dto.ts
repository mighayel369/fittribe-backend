
import {
  PaginationRequestDTO,
  PaginationRequestSchema,
} from "application/dto/common/PaginationDto";

import {
  BookingFiltersSchema,
  IBookingFilters
} from "domain/filters/IBookingFilters";


export const FetchAllBookingQuerySchema = PaginationRequestSchema(BookingFiltersSchema)

export type fetchAllBookingQueryDTO = PaginationRequestDTO<IBookingFilters>





