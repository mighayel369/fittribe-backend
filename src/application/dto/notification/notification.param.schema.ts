import { z } from "zod";

export const NotificationIdParamSchema =
    z.object({
        notificationId: z.string().trim().min(1, "Notification id is required")
    });

export type NotificationParams =
    z.infer<typeof NotificationIdParamSchema>;