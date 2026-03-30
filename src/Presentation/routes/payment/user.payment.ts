import express from "express";
import { UserPaymentController } from "Presentation/controllers/payment/user.payment.controller";
import { container } from "tsyringe";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { initiatePaymentSchema,verifyPaymentSchema } from "Presentation/validators/payment-schema";
const router = express.Router();
const ctrl = container.resolve(UserPaymentController);


router.post(
  '/initiate', 
  validateRequest(initiatePaymentSchema), 
  ctrl.initiateOnlinePayment
);

router.post(
  '/verify', 
  validateRequest(verifyPaymentSchema), 
  ctrl.verifyOnlinePayment
);

export default router;