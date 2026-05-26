import { z } from "zod";
import { UserRole } from "domain/constants/user-role";

export const AuthUserPayloadSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
});

export type AuthUserPayloadDTO = z.infer<typeof AuthUserPayloadSchema>;

export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    role: z.enum(UserRole),
    user: AuthUserPayloadSchema,
});

export type LoginResponseDTO = z.infer<typeof LoginResponseSchema>;