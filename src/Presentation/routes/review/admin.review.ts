import { AdminReviewController } from "Presentation/controllers/review/admin.review.controller";
import express from "express";
import { container } from "tsyringe";

const router=express.Router()
const ctrl=container.resolve(AdminReviewController)
router.get('/get-list',ctrl.getReviewList)
router.get('/flag-review/:id',ctrl.flagReview)

export default router