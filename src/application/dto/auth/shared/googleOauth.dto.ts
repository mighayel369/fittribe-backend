import { z } from "zod";
import { UserRole } from "domain/constants/user-role";

export const GoogleOAuthUserSchema = z.object({
    id: z.string().trim().min(1, "User ID is missing"),
    email: z.email("Invalid email address"),
    role: z.enum(UserRole)
});

export const GoogleOAuthCallbackSchema = z.object({
    accessToken: z.string().trim().min(1, "Access token is missing"),
    user: GoogleOAuthUserSchema
});

export type GoogleOAuthUserDTO = z.infer<typeof GoogleOAuthUserSchema>;
export type GoogleOAuthCallbackDTO = z.infer<typeof GoogleOAuthCallbackSchema>;