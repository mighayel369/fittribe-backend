
import { PAGINATION } from "utils/Constants";
import { z } from "zod";

export const PaginationRequestSchema = <F extends z.ZodTypeAny>(filterSchema?: F) =>

  z.object({
    currentPage: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(PAGINATION.DEFAULT_LIMIT),
    filter: filterSchema?.optional()
  });


export const PaginationResponseSchema =
  <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
      data: z.array(itemSchema),
      totalPages: z.number(),
      currentPage: z.number(),
      totalCount: z.number().optional()
    });


export type PaginationRequestDTO<F = unknown> = {
  currentPage: number;
  limit: number;
  filter?: F;
};

export type PaginationResponseDTO<T> = {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalCount?: number;
};