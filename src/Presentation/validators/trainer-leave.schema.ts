import { z } from 'zod';
import { LEAVE_TYPES } from "utils/Constants";

export const applyLeaveSchema = z.object({
  type: z.nativeEnum(LEAVE_TYPES).refine((val) => !!val, {
    message: "Please select a valid leave type",
  }),

  startDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid start date",
  }),

  endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid end date",
  }),

  reason: z.string()
    .min(10, "Reason must be at least 10 characters long")
    .max(500, "Reason is too long"),
}).refine((data) => {

  return data.endDate.getTime() >= data.startDate.getTime();
}, {
  message: "End date cannot be earlier than start date",
  path: ["endDate"],
});

export const leaveHistorySchema = z.object({
    pageNo: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(5),
    search: z.string().optional().default(""),
});
export const withdrawLeaveSchema = z.object({
  leaveId: z.string().min(1,"Invalid UUID format"),
});
