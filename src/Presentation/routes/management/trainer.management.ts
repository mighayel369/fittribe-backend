import express from "express";
import { TrainerManagementController } from "Presentation/controllers/management/trainer.mgmt";
import { container } from "tsyringe";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { FetchAllTrainersRequestSchema } from "application/dto/discovery/fetch-all-trainer.request.dto";
import { trainerIdParamSchema } from "application/dto/discovery/trainer-id-param.dto";

import { UpdateTrainerStatusRequestSchema } from "application/dto/management/trainer-management/update-trainer-status.dto";
import { TrainerApprovalSchema } from "application/dto/management/trainer-management/trainer-approval.dto";


const router = express.Router();
const ctrl = container.resolve(TrainerManagementController);

router.get('/verified', validateRequest(FetchAllTrainersRequestSchema, "query"), ctrl.getVerifiedTrainers);
router.get('/pending', validateRequest(FetchAllTrainersRequestSchema, "query"), ctrl.getPendingTrainers);


router.get('/:trainerId', validateRequest(trainerIdParamSchema, 'params'), ctrl.getTrainerDetails);

router.patch('/status', validateRequest(UpdateTrainerStatusRequestSchema), ctrl.updateAccountStatus);
router.patch('/verify', validateRequest(TrainerApprovalSchema), ctrl.approveOrRejectTrainer);

export default router;