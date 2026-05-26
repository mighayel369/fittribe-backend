import { z } from "zod";

import { passwordRules } from "domain/constants/password-validation";

export const ChangePasswordRequestSchema =
    z.object({
        oldPassword: z.string({ message: "Current password is required" }).min(1, "Current password cannot be empty"),
        newPassword: z.string({ message: "New password is required" }).min(8, "New password must be at least 8 characters long")
            .max(15, "New password cannot exceed 15 characters")
            .refine(
                (value) => passwordRules.uppercase.test(value),
                {
                    message: "New password must contain at least one uppercase letter"
                }
            )
            .refine(
                (value) => passwordRules.lowercase.test(value),
                {
                    message: "New password must contain at least one lowercase letter"
                }
            )
            .refine((value) => passwordRules.number.test(value),
                {
                    message: "New password must contain at least one number"
                }
            )
            .refine((value) => passwordRules.specialChar.test(value), {
                message: "New password must contain at least one special character"
            })
    }
    );

export type ChangePasswordRequestDTO = z.infer<typeof ChangePasswordRequestSchema>;