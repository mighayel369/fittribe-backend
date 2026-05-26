import { USER_STATUS_FILTERS } from "utils/Constants";
import { z } from "zod";

export const UserFiltersSchema =
    z.object({
        search: z.string().trim().optional(),
        status: z.enum(USER_STATUS_FILTERS).optional()
    });

export type IUserFilters = z.infer<typeof UserFiltersSchema>;