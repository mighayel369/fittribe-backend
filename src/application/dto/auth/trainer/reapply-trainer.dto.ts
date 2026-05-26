import { z } from "zod";
import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "domain/constants/language-type";

export const reapplyTrainerSchema = z.object({
  name: z.string().min(3),
  gender: z.enum(GENDER),
  experience: z.coerce.number().nonnegative(),

  programs: z.array(z.string()),

  languages: z.array(z.enum(LANGUAGE)),

  pricePerSession: z.coerce.number().positive()
});

export type ReapplyTrainerDTO =
  z.infer<typeof reapplyTrainerSchema>;