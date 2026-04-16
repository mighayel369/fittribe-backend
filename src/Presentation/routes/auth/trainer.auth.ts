import express from "express";
import { container } from "tsyringe";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { trainerRegisterSchema,loginSchema,verifyOtpSchema } from "Presentation/validators/auth.schema";
import { TrainerAuthController } from "Presentation/controllers/auth/trainer.auth.controller";
import { upload } from "Presentation/middleware/upload";
const router = express.Router();
const ctrl = container.resolve(TrainerAuthController);

router.post(
    '/register', 
    upload.single('certificate'), 
    validateRequest(trainerRegisterSchema), 
    ctrl.register
);

router.post(
    '/login', 
    validateRequest(loginSchema), 
    ctrl.login
);

router.post(
    '/verify-otp', 
    validateRequest(verifyOtpSchema), 
    ctrl.verifyOtp
);



export default router;