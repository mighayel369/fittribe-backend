import express from "express";
import { container } from "tsyringe";
import { SessionController } from "Presentation/controllers/auth/session.controller";
const router = express.Router();
const ctrl = container.resolve(SessionController);

router.post('/resend-otp', ctrl.resendOtp);
router.get('/refresh-token', ctrl.refreshAccessToken);

export default router;