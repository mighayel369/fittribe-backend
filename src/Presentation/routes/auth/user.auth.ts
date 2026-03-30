import express from "express";
import { container } from "tsyringe";
import { UserAuthController } from "Presentation/controllers/auth/user.auth.controller";
import passport from 'passport';
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { loginSchema,userRegisterSchema,verifyOtpSchema,forgotPasswordSchema,resetPasswordSchema} from "Presentation/validators/auth.schema";
const router = express.Router();
const ctrl = container.resolve(UserAuthController);

router.post('/register',validateRequest(userRegisterSchema), ctrl.register);
router.post('/login',validateRequest(loginSchema), ctrl.login);

router.post('/forgot-password',validateRequest(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password/:token',validateRequest(loginSchema), ctrl.resetPassword);


router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), 
  (req: any, res) => {
    const { accessToken } = req.user;
    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
  }
);

router.post('/verify-otp',validateRequest(verifyOtpSchema), ctrl.verifyOtp);
export default router;