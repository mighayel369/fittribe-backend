import { AdminReviewController } from "Presentation/controllers/review/admin.review.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { reviewIdSchema } from "Presentation/validators/review.schema";
import express from "express";
import { container } from "tsyringe";

const router=express.Router()
const ctrl=container.resolve(AdminReviewController)
router.get('/get-list',ctrl.getReviewList)
router.get('/flag-review/:reviewId',validateRequest(reviewIdSchema,'params'),ctrl.flagReview)

export default router