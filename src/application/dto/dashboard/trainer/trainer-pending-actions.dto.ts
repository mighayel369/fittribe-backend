import { z } from "zod";

export const PendingActionsSchema = z.object({
    bookingId: z.string(),
    type: z.string(),
    clientName: z.string(),
    detail: z.string(),
    time: z.string()
});

export type pendingActionsDTO =
    z.infer<typeof PendingActionsSchema>;