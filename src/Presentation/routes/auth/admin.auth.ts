import express from "express";
import { container } from "tsyringe";
import { AdminAuthController } from "Presentation/controllers/auth/admin.auth.controller";
const router = express.Router();
const ctrl = container.resolve(AdminAuthController);
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { LoginRequestSchema } from "application/dto/auth/shared/login.request.dto";

router.post('/login',validateRequest(LoginRequestSchema),ctrl.login);
export default router;