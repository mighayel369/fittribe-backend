import express from "express";
import { container } from "tsyringe";
import { TrainerDiscoveryController } from "presentation/controllers/discovery/trainer.discovery.controller";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { trainerIdParamSchema } from "application/dto/discovery/trainer-id-param.dto";
import { TrainerAvailabilityQuerySchema } from "application/dto/discovery/trainer-slots.dto";
import { FetchAllTrainersRequestSchema } from "application/dto/discovery/fetch-all-trainer.request.dto";


const router = express.Router();
const ctrl = container.resolve(TrainerDiscoveryController);

router.get('/explore',validateRequest(FetchAllTrainersRequestSchema,'query'), ctrl.exploreTrainers);
router.get('/explore/:trainerId', validateRequest(trainerIdParamSchema, 'params'), ctrl.getTrainerDetails);
router.get('/availability', validateRequest(TrainerAvailabilityQuerySchema, 'query'), ctrl.getAvailability);
router.get('/review-list/:trainerId', validateRequest(trainerIdParamSchema, 'params'), ctrl.getReviewList)
export default router;