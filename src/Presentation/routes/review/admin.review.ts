import { AdminReviewController } from "Presentation/controllers/review/admin.review.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { ReviewIdParamSchema } from "application/dto/review/shared/review-id-param.dto";
import express from "express";
import { container } from "tsyringe";

const router = express.Router()
const ctrl = container.resolve(AdminReviewController)
router.get('/get-list', ctrl.getReviewList)
router.get('/flag-review/:reviewId', validateRequest(ReviewIdParamSchema, 'params'), ctrl.flagReview)

export default router