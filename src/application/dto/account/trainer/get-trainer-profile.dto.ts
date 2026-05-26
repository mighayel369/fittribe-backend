import { z } from "zod";
import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "domain/constants/language-type";
import { TRAINER_STATUS } from "domain/constants/trainer-status";

export const TrainerProgramItemSchema = z.object({
  programId: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
});

export const TrainerProfileSchema = z.object({
  trainerId: z.string(),
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  gender: z.enum(GENDER),
  address: z.string(),
  bio: z.string(),
  profilePic: z.string(),
  experience: z.number().nonnegative(),
  languages: z.array(z.enum(LANGUAGE)),
  pricePerSession: z.number().positive(),
  status: z.boolean(),
  verified: z.enum(TRAINER_STATUS),
  rejectReason: z.string(),
  certificate: z.string(),
  joined: z.string(),
  rating: z.number().min(0).max(5),
  programs: z.array(TrainerProgramItemSchema),
});


export type TrainerProfileDTO = z.infer<typeof TrainerProfileSchema>;
