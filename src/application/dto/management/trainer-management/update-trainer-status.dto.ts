import { z } from "zod";

export const UpdateTrainerStatusRequestSchema =
    z.object({
        trainerId: z.string().trim().min(1, "Id is required"),
        isActive: z.boolean()
    });

export type UpdateTrainerStatusRequestDTO = z.infer<typeof UpdateTrainerStatusRequestSchema>;