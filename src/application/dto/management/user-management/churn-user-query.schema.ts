import { z } from "zod";
import { DATE_RANGES } from "utils/Constants";

export const ChurnUserQuerySchema =
    z.object({
        range: z.enum(DATE_RANGES, { error: "Invalid report range" })
    });

export type ChurnUserQueryDTO = z.infer<typeof ChurnUserQuerySchema>;