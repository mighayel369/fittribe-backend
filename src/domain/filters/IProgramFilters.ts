
import { z } from "zod";

export const ProgramFiltersSchema =
  z.object({
    search:
      z.string()
        .trim()
        .optional()
  });

export type IProgramFilters =
  z.infer<typeof ProgramFiltersSchema>;