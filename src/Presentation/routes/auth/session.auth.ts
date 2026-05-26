import express from "express";
import { container } from "tsyringe";
import { SessionController } from "Presentation/controllers/auth/session.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { ResendOtpRequestSchema } from "application/dto/auth/shared/resend-otp.dto";
const router = express.Router();
const ctrl = container.resolve(SessionController);

router.post('/resend-otp', validateRequest(ResendOtpRequestSchema), ctrl.resendOtp);
router.get('/refresh-token', ctrl.refreshAccessToken);
router.post('/logout', ctrl.logout);
export default router;