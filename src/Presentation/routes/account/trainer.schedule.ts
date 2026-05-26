import express from "express";
import { container } from "tsyringe";
import { TrainerScheduleController } from "Presentation/controllers/account/trainer.schedule.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { SyncWeeklyAvailabilityRequestSchema } from "application/dto/schedules/update-slot-config";
const router = express.Router();
const ctrl = container.resolve(TrainerScheduleController);


router.get('/config', ctrl.getSchedule);

router.put(
  '/weekly-template',
  validateRequest(SyncWeeklyAvailabilityRequestSchema),
  ctrl.syncWeeklyAvailability
);
export default router;