import express from "express";
import { UserPaymentController } from "presentation/controllers/payment/user.payment.controller";
import { container } from "tsyringe";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { CreateOnlinePaymentSchema } from "application/dto/payment/create-online-payment.dto";
import { VerifyPaymentRequestSchema } from "application/dto/payment/online-payment.dto";
const router = express.Router();
const ctrl = container.resolve(UserPaymentController);


router.post(
  '/initiate',
  validateRequest(CreateOnlinePaymentSchema),
  ctrl.initiateOnlinePayment
);

router.post(
  '/verify',
  validateRequest(VerifyPaymentRequestSchema),
  ctrl.verifyOnlinePayment
);

export default router;