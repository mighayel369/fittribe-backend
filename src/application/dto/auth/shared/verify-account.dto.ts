import { z } from "zod";

export const VerifyAccountRequestSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().trim().length(6, "OTP must be 6 digits")
});

export type VerifyAccountRequestDTO = z.infer<typeof VerifyAccountRequestSchema>;