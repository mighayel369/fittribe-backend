import { z } from "zod";

import { GENDER } from "domain/constants/gender";

export const UserProfileResponseSchema =
  z.object({
    userId: z.string(),
    name: z.string(),
    email: z.email(),
    role: z.string(),
    gender: z.enum(GENDER).optional(),
    age: z.number().optional(),
    phone: z.string(),
    address: z.string(),
    profilePic: z.string()
  });

export type UserProfileResponseDTO = z.infer<typeof UserProfileResponseSchema>;