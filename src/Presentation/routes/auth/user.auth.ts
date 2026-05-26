import express from "express";
import { container } from "tsyringe";
import { UserAuthController } from "Presentation/controllers/auth/user.auth.controller";
import passport from 'passport';
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { LoginRequestSchema } from "application/dto/auth/shared/login.request.dto";
import { RegisterResponseSchema } from "application/dto/auth/shared/register.response.dto";
import { ForgotPasswordSchema } from "application/dto/auth/shared/forgot-password.dto";
import { ResetPasswordRequestSchema } from "application/dto/auth/shared/reset-password.dto";
import { VerifyAccountRequestSchema } from "application/dto/auth/shared/verify-account.dto";
import { GoogleOAuthCallbackSchema } from "application/dto/auth/shared/googleOauth.dto";
const router = express.Router();
const ctrl = container.resolve(UserAuthController);

router.post('/register', validateRequest(RegisterResponseSchema), ctrl.register);
router.post('/login', validateRequest(LoginRequestSchema), ctrl.login);

router.post('/forgot-password', validateRequest(ForgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password', validateRequest(ResetPasswordRequestSchema), ctrl.resetPassword);


router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), validateRequest(GoogleOAuthCallbackSchema, 'user'), ctrl.googleCallback);

router.post('/verify-otp', validateRequest(VerifyAccountRequestSchema), ctrl.verifyOtp);
export default router;