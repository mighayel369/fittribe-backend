import { z } from 'zod';

const arrayProcess = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '') return [val];
    return [];
};

export const updateTrainerProfileSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    gender: z.enum(["male", "female", "other"]),
    bio: z.string().max(500, "Bio is too long").optional(),
    phone: z.string().length(10, "Phone number must be 10 digits"),
    address: z.string().min(5, "Address is too short"),
    experience: z.coerce.number().min(0),
    pricePerSession: z.coerce.number().positive(),
    programs: z.preprocess(arrayProcess, z.array(z.string()).min(1, "Select at least one program")),
    languages: z.preprocess(arrayProcess, z.array(z.string()).min(1, "Select at least one language")),
});

export const reapplyTrainerSchema = z.object({
    name: z.string().min(2),
    gender: z.enum(["male", "female", "other"]),
    experience: z.coerce.number().min(0),
    pricePerSession: z.coerce.number().positive(),
    programs: z.preprocess(arrayProcess, z.array(z.string()).min(1)),
    languages: z.preprocess(arrayProcess, z.array(z.string()).min(1)),
});