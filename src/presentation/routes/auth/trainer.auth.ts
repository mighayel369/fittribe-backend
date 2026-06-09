import express from "express";
import { container } from "tsyringe";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { TrainerAuthController } from "presentation/controllers/auth/trainer.auth.controller";
import { upload } from "presentation/middleware/upload";
import { CertificateFileSchema } from "application/dto/auth/trainer/certificate-file.schema";
import { TrainerRegisterBodySchema } from "application/dto/auth/trainer/trainer.register.dto";
import { LoginRequestSchema } from "application/dto/auth/shared/login.request.dto";
import { VerifyAccountRequestSchema } from "application/dto/auth/shared/verify-account.dto";
const router = express.Router();
const ctrl = container.resolve(TrainerAuthController);

router.post(
    '/register',
    upload.single('certificate'),
    validateRequest(CertificateFileSchema,'file'),
    validateRequest(TrainerRegisterBodySchema),
    ctrl.register
);

router.post(
    '/login',
    validateRequest(LoginRequestSchema),
    ctrl.login
);

router.post(
    '/verify-otp',
    validateRequest(VerifyAccountRequestSchema),
    ctrl.verifyOtp
);



export default router;