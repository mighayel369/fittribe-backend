import { z } from "zod";
import { UserRole } from "domain/constants/user-role";
import { GENDER } from "domain/constants/gender";
import { LANGUAGE } from "domain/constants/language-type";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { passwordRules } from "domain/constants/password-validation";

export const TrainerRegisterBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long")
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
      message: "Password must contain at least one special character",
    }),

  gender: z.enum(GENDER),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  pricePerSession: z.coerce.number().min(0, "Price per session cannot be negative"),
  programs: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [val];
      }
    }

    return val;
  }, z.array(z.string()).min(1, "Select at least one program")),

  languages: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [val];
      }
    }

    return val;
  }, z.array(z.enum(LANGUAGE)).min(1, "Select at least one language")),

  role: z.literal(UserRole.TRAINER).default(UserRole.TRAINER),

  verified: z.enum(TRAINER_STATUS).default(TRAINER_STATUS.PENDING),
});

export type TrainerRegisterRequestDTO = z.infer<typeof TrainerRegisterBodySchema>;