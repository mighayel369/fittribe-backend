
import { TrainerSortOptions } from "utils/Constants";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { GENDER } from "domain/constants/gender";
import { z } from "zod";
import { LANGUAGE } from "domain/constants/language-type";
import config from "config";


export const TrainerFiltersSchema =
    z.object({
        status: z.enum(TRAINER_STATUS).optional(),
        search: z.string().trim().optional(),
        gender: z.enum(GENDER).optional(),
        programId: z.string().trim().optional(),
        availability: z.string().optional(),
        language: z.enum(LANGUAGE).optional(),
        sort: z.enum(TrainerSortOptions).optional(),
        startPrice: z.coerce.number().optional(),
        endPrice: z.coerce.number().optional(),
    });

export type ITrainerFilters = z.infer<typeof TrainerFiltersSchema>;