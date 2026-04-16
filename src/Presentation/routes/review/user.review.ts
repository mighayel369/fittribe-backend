import { UserReviewController } from "Presentation/controllers/review/user.review.controller";
import express from "express";
import { container } from "tsyringe";

const router=express.Router()
const ctrl=container.resolve(UserReviewController)
router.post('/add-review',ctrl.addReview)

export default router