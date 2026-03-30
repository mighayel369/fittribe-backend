import express from "express";
import { container } from "tsyringe";
import { TrainerScheduleController } from "Presentation/controllers/account/trainer.schedule.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { syncWeeklyAvailabilitySchema } from "Presentation/validators/trainer-schedule.schema";
const router = express.Router();
const ctrl = container.resolve(TrainerScheduleController);


router.get('/config', ctrl.getSchedule);

router.put(
  '/weekly-template', 
  validateRequest(syncWeeklyAvailabilitySchema), 
  ctrl.syncWeeklyAvailability
);
export default router;