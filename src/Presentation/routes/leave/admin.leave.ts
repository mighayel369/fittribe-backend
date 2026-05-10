import express from "express";
import { container } from "tsyringe";
import { AdminLeaveManagementController } from "Presentation/controllers/leave/admin.leave.controller";
import { updateLeaveStatusSchema, adminQuerySchema } from "Presentation/validators/admin-mngmnt-schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";

const router = express.Router();
const ctrl = container.resolve(AdminLeaveManagementController);


router.get('/metrics', ctrl.getLeaveMetrics);

router.get(
  '/history', 
  validateRequest(adminQuerySchema, "query"), 
  ctrl.getLeaveRequestsHistory
);

router.patch(
  '/update-status', 
  validateRequest(updateLeaveStatusSchema), 
  ctrl.updateLeaveStatus
);


router.get('/export-report', ctrl.exportLeaveReport);

export default router;