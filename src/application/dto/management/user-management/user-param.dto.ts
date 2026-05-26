import { z } from "zod";

export const UserIdParamSchema =
    z.object({
        userId: z.string().trim().min(1, "User id is required")
    });

export type UserParams = z.infer<typeof UserIdParamSchema>;