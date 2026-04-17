import { z } from 'zod';

export const notificationIdParamSchema = z.object({
  notificationId: z.string().min(1,"Invalid Notification ID format"),
});