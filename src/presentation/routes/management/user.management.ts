import express from "express";
import { UserManagementController } from "presentation/controllers/management/user.mgmt";
import { container } from "tsyringe";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { FetchAllUsersQuerySchema } from "application/dto/management/user-management/all-users.dto";
import { UserIdParamSchema } from "application/dto/management/user-management/user-param.dto";
import { UpdateUserStatusRequestSchema } from "application/dto/management/user-management/update-user-status.dto";
import { ChurnUserQuerySchema } from "application/dto/management/user-management/churn-user-query.schema";
const router = express.Router();
const ctrl = container.resolve(UserManagementController);



router.get('/', validateRequest(FetchAllUsersQuerySchema, "query"), ctrl.getAllUsers);

router.get('/export-churn-user', validateRequest(ChurnUserQuerySchema, "query"), ctrl.exportChurnUsers)

router.get('/:userId', validateRequest(UserIdParamSchema, "params"), ctrl.getUserDetails);

router.patch('/status', validateRequest(UpdateUserStatusRequestSchema), ctrl.toggleUserStatus);

export default router;