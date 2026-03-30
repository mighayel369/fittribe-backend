import express from "express";
import { TrainerManagementController } from "Presentation/controllers/management/trainer.mgmt";
import { container } from "tsyringe";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { updateTrainerStatusSchema,trainerApprovalSchema,trainerQuerySchema } from "Presentation/validators/trainer-mgmt-schema";


const router = express.Router();
const ctrl = container.resolve(TrainerManagementController);

router.get('/verified', validateRequest(trainerQuerySchema, "query"), ctrl.getVerifiedTrainers);
router.get('/pending', validateRequest(trainerQuerySchema, "query"), ctrl.getPendingTrainers);


router.get('/:id', ctrl.getTrainerDetails);

router.patch('/:id/status', validateRequest(updateTrainerStatusSchema), ctrl.updateAccountStatus); 
router.patch('/:id/verify', validateRequest(trainerApprovalSchema), ctrl.approveOrRejectTrainer);

export default router;