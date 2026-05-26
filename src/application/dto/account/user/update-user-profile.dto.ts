import { z } from "zod";

import { GENDER } from "domain/constants/gender";

export const UpdateUserProfileRequestSchema =
  z.object({
    name: z.string().trim().min(3, "Name must contain at least 3 characters"),
    phone: z.string().trim().min(10, "Phone number is invalid"),
    address: z.string().trim().min(3, "Address is required"),
    gender: z.enum(GENDER).optional(),
    age: z.coerce.number().positive().optional()
  });

export type UpdateUserProfileRequestDTO = z.infer<typeof UpdateUserProfileRequestSchema>;