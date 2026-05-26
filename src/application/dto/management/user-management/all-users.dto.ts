import { z } from "zod";

import {
  PaginationResponseDTO,
  PaginationRequestSchema,
  PaginationResponseSchema
} from "application/dto/common/PaginationDto";

import {
  UserFiltersSchema
} from "domain/filters/IUserFilters";

export const FetchAllUsersQuerySchema =
  PaginationRequestSchema(
    UserFiltersSchema
  );

  export type FetchAllUsersQueryInput=z.infer<typeof FetchAllUsersQuerySchema>


export const UserResponseSchema =
  z.object({
    userId: z.string(),
    name: z.string(),
    email: z.email(),
    status: z.boolean()
  });

export type UserResponseDTO = z.infer<typeof UserResponseSchema>;

export const FetchAllUsersResponseSchema =
  PaginationResponseSchema(
    UserResponseSchema
  );

export type FetchAllUsersResponseDTO = PaginationResponseDTO<UserResponseDTO>;