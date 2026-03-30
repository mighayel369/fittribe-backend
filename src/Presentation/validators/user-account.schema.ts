import { z } from 'zod';

export const updateUserProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    address: z.string().min(5, "Address is too short"),
    gender: z.enum(["male", "female", "other"]).optional(),
    age: z.coerce.number().min(13, "Must be at least 13 years old").max(100).optional(),
});