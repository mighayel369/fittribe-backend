
import { z } from "zod";

export const ProgramIdSchema =
    z.object({
        programId: z.string().trim().min(
            1,
            "Program ID is required"
        )
    });

export type ProgramParams = z.infer<typeof ProgramIdSchema>;