import express from "express";
import { container } from "tsyringe";
import { NotificationController } from "Presentation/controllers/notification/notification-controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { notificationIdParamSchema } from "Presentation/validators/notification-schema";
const router = express.Router();
const ctrl = container.resolve(NotificationController);
router.get('/get',ctrl.getNotifications)
router.patch(
  '/mark-as-read/:id', 
  validateRequest(notificationIdParamSchema, "params"), 
  ctrl.markAsRead
);
router.patch('/mark-all-as-read',ctrl.markAllAsRead)
export default router;