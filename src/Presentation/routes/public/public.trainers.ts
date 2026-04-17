import express from "express";
import { container } from "tsyringe";
import { TrainerDiscoveryController } from "Presentation/controllers/discovery/trainer.discovery.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { trainerIdSchema } from "Presentation/validators/trainer-mgmt-schema";

const router = express.Router();
const ctrl = container.resolve(TrainerDiscoveryController);

router.get('/explore', ctrl.exploreTrainers);
router.get('/explore/:trainerId',validateRequest(trainerIdSchema,'params'), ctrl.getTrainerDetails);
router.get('/availability', ctrl.getAvailability);
router.get('/review-list/:trainerId',validateRequest(trainerIdSchema,'params'),ctrl.getReviewList)
export default router;