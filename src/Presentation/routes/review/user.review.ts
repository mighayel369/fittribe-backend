import { UserReviewController } from "Presentation/controllers/review/user.review.controller";
import express from "express";
import { container } from "tsyringe";
import { addReviewSchema } from "Presentation/validators/review.schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";
const router=express.Router()
const ctrl=container.resolve(UserReviewController)


router.post(
    '/add-review', 
    validateRequest(addReviewSchema), 
    ctrl.addReview
);

export default router