import { TrainerReviewController } from "Presentation/controllers/review/trainer.review.controller";
import express from "express";
import { container } from "tsyringe";

const router=express.Router()
const ctrl=container.resolve(TrainerReviewController)
router.get('/get-list',ctrl.getReviewList)

export default router