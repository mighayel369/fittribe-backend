import { z } from 'zod';

const arrayProcess = (val: any) => {
  if (Array.isArray(val)) return val
  if (typeof val === 'string' && val.trim() !== '') return [val];
  return [];
}

export const trainerRegisterSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"]),
  experience: z.coerce.number().min(0),
  pricePerSession: z.coerce.number().positive(),
  programs: z.preprocess(arrayProcess, z.array(z.string()).min(1, "Select at least one program")),
  languages: z.preprocess(arrayProcess, z.array(z.string()).min(1, "Select at least one language")),
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
    email: z.email("Invalid email format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export const userRegisterSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required")
})

export const forgotPasswordSchema=z.object({
  email:z.email("Invalid email format")
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is missing"), 
  password: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "New password must contain at least one special character")
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "New password must contain at least one special character")
}).refine((data) => data.newPassword !== data.oldPassword, {
  message: "New password cannot be the same as the old password",
  path: ["newPassword"],
});