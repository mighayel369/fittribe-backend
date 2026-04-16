import express from "express";
import { container } from "tsyringe";
import { TrainerDiscoveryController } from "Presentation/controllers/discovery/trainer.discovery.controller";

const router = express.Router();
const ctrl = container.resolve(TrainerDiscoveryController);

router.get('/explore', ctrl.exploreTrainers);
router.get('/explore/:id', ctrl.getTrainerDetails);
router.get('/availability', ctrl.getAvailability);
router.get('/review-list/:id',ctrl.getReviewList)
export default router;