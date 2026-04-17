import { z } from 'zod';

export const updateTrainerStatusSchema = z.object({
    status: z.boolean("Status required"),
    trainerId: z.string().min(1, "invalid trainerId format")
});

export const trainerApprovalSchema = z.object({
    action: z.enum(["accept", "reject"], "Action must be either 'accept' or 'reject'"),
    trainerId: z.string().min(1, "invalid trainerId format"),
    reason: z.string()
        .max(500, "Reason cannot exceed 500 characters")
        .optional(),
}).superRefine((data, ctx) => {
    if (data.action === 'reject' && (!data.reason || data.reason.trim().length < 5)) {
        ctx.addIssue({
            code: "custom",
            message: "A valid reason (min 5 chars) is required for rejection",
            path: ["reason"],
        });
    }
});

export const trainerQuerySchema = z.object({
    pageNo: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    search: z.string().optional().default(""),
});

export const trainerIdSchema = z.object({
    trainerId: z.string().min(1, "Invalid trainer ID format")
});
