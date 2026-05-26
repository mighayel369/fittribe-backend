import { z } from "zod";

export const UpdateUserStatusRequestSchema =
    z.object({
        userId: z.string().trim().min(1, "Id is required"),
        isActive: z.boolean()
    });

export type UpdateUserStatusRequestDTO = z.infer<typeof UpdateUserStatusRequestSchema>;