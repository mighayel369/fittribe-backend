import { z } from 'zod';
import { passwordRules } from 'domain/constants/password-validation';

export const UserRegisterRequestSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name cannot be empty"),

    email: z.email({ message: "Invalid email format" }),

    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(15, "Password cannot exceed 15 characters")
        .refine((val) => passwordRules.uppercase.test(val), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((val) => passwordRules.lowercase.test(val), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((val) => passwordRules.number.test(val), {
            message: "Password must contain at least one number",
        })
        .refine((val) => passwordRules.specialChar.test(val), {
            message: "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &)",
        }),
});

export type UserRegisterRequestDTO = z.infer<typeof UserRegisterRequestSchema>;