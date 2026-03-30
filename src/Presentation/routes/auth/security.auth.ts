import express from "express";
import { container } from "tsyringe";
import { SecurityController } from "Presentation/controllers/auth/security.controller";
import { changePasswordSchema } from "Presentation/validators/auth.schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";
const router = express.Router();
const ctrl = container.resolve(SecurityController);
router.post('/logout', ctrl.logout);
router.post(
  '/change-password',validateRequest(changePasswordSchema), ctrl.changePassword
);

export default router;