import express from "express";
import { UserManagementController } from "Presentation/controllers/management/user.mgmt";
import { container } from "tsyringe";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { adminUserIdParamSchema,updateUserStatusSchema,userQuerySchema } from "Presentation/validators/user-mgnt-schema";
const router = express.Router();
const ctrl = container.resolve(UserManagementController);



router.get('/', validateRequest(userQuerySchema, "query"), ctrl.getAllUsers);

router.get('/:id', validateRequest(adminUserIdParamSchema, "params"), ctrl.getUserDetails);

router.patch(
  '/:id/status', 
  validateRequest(adminUserIdParamSchema, "params"), 
  validateRequest(updateUserStatusSchema), 
  ctrl.toggleUserStatus
);
export default router;