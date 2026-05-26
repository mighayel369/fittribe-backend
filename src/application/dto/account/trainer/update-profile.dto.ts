import { z } from "zod";
import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "domain/constants/language-type";

export const updateProfileSchema =
  z.object({
    name: z.string().min(3),
    gender: z.enum(GENDER),
    experience: z.coerce.number().nonnegative(),
    languages: z.array(z.enum(LANGUAGE)),
    bio: z.string().max(500),
    phone: z.string().min(10),
    address: z.string().max(300),
    pricePerSession: z.coerce.number().positive(),
    programs: z.array(z.string())
  });

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
