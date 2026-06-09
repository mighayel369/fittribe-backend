import { UserReviewController } from "presentation/controllers/review/user.review.controller";
import express from "express";
import { container } from "tsyringe";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { AddReviewSchema } from "application/dto/review/user/add-review.dto";
const router=express.Router()
const ctrl=container.resolve(UserReviewController)


router.post(
    '/add-review', 
    validateRequest(AddReviewSchema), 
    ctrl.addReview
);

export default router