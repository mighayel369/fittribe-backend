
import { z } from "zod";
import { passwordRules } from "domain/constants/password-validation";
export const ResetPasswordRequestSchema = z.object({
    token: z
        .string("Reset token is required")
        .trim()
        .min(1, "Token context cannot be blank"),

    password: z
        .string("New password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(15, "Password cannot exceed 15 characters")
        .refine(
            (value) => passwordRules.uppercase.test(value),
            {
                message: "Password must contain at least one uppercase letter"
            }
        )
        .refine(
            (value) => passwordRules.lowercase.test(value),
            {
                message: "Password must contain at least one lowercase letter"
            }
        )
        .refine(
            (value) => passwordRules.number.test(value),
            {
                message: "Password must contain at least one number"
            }
        )
        .refine(
            (value) => passwordRules.specialChar.test(value),
            {
                message: "Password must contain at least one special character (e.g., @, $, !, %)"
            }
        )
});

export type ResetPasswordRequestDTO = z.infer<typeof ResetPasswordRequestSchema>;