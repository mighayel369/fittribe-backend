import { z } from "zod";

import { UserRole } from "domain/constants/user-role";
import { LANGUAGE } from "domain/constants/language-type";
import { GENDER } from "domain/constants/gender";
import { TRAINER_STATUS } from "domain/constants/trainer-status";

import {
    ProgramInfoSchema
} from "application/dto/discovery/public-trainer-details.dto";


export const AdminTrainerDetailsSchema =
    z.object({
        trainerId: z.string(),
        name: z.string(),
        email: z.email(),
        role: z.literal(UserRole.TRAINER),
        profilePic: z.string().nullable(),
        gender: z.enum(GENDER),
        experience: z.number(),
        languages: z.array(z.enum(LANGUAGE)),
        pricePerSession: z.number(),
        programs: z.array(ProgramInfoSchema),
        certificate: z.string(),
        verified: z.enum(TRAINER_STATUS),
        status: z.boolean(),
        joined: z.string(),
        rejectReason: z.string().optional()
    });

export type AdminTrainerDetailsDTO = z.infer<typeof AdminTrainerDetailsSchema>