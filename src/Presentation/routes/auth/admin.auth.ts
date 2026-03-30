import express from "express";
import { container } from "tsyringe";
import { AdminAuthController } from "Presentation/controllers/auth/admin.auth.controller";
const router = express.Router();
const ctrl = container.resolve(AdminAuthController);
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { loginSchema } from "Presentation/validators/auth.schema";
router.post('/login',validateRequest(loginSchema), ctrl.login);
export default router;