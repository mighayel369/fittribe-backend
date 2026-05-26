import { z } from "zod";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { UserRole } from "domain/constants/user-role";

export const TrainerSessionResponseSchema =
    z.object({
        name:z.string(),
        role:z.literal(UserRole.TRAINER),
        profilePic:z.string(),
        status:z.boolean(),
        verified:z.enum(TRAINER_STATUS)
    });

export type TrainerSessionResponseDTO = z.infer<typeof TrainerSessionResponseSchema>;