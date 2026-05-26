

import { z } from "zod";
import { UserRole } from "domain/constants/user-role";

export const ResendOtpRequestSchema = z.object({
  email: z.email(),
  role: z.enum(UserRole)
});

export type ResendOtpRequestDTO = z.infer<typeof ResendOtpRequestSchema>;