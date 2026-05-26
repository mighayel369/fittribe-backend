
import { z } from "zod";
import { UserRole } from "domain/constants/user-role";



export const RefreshAccessTokenResponseSchema = z.object({
  accessToken: z.string(),
  role: z.enum(UserRole)
});

export type RefreshAccessTokenResponseDTO = z.infer<typeof RefreshAccessTokenResponseSchema>;