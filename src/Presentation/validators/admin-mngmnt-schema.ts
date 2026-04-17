import { z } from 'zod';

export const updateLeaveStatusSchema = z.object({
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toLowerCase() : val),
    z.enum(["approved", "rejected", "pending"])
  ),
  adminComment: z.string()
    .max(500, "Comment cannot exceed 500 characters")
    .optional(),
    leaveId:z.string("invalid leaveId format")
});

export const adminQuerySchema = z.object({
  pageNo: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(""),
});