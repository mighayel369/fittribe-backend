import { z } from 'zod';

export const onboardProgramSchema = z.object({
  name: z.string()
    .min(3, "Program name must be at least 3 characters")
    .max(50, "Program name is too long"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
});


export const modifyProgramSchema = onboardProgramSchema.partial();

export const toggleVisibilitySchema = z.object({
  status: z.boolean("Status required"),
  programId:z.string().min(1,"invalid programId")
});

export const inventoryQuerySchema = z.object({
  pageNo: z.coerce.number().min(1).default(1),
  search: z.string().optional().default(""),
});

export const ProgramIdSchema = z.object({
  programId: z.string("Invalid Program ID format")
});
