
import { z } from "zod";

export const NotificationResponseSchema =
  z.object({
    _id: z.string(),
    title: z.string(),
    message: z.string(),
    isRead: z.boolean(),
    time: z.string()
  });

export type NotificationResponseDTO = z.infer<typeof NotificationResponseSchema>;