import express from "express";
import { container } from "tsyringe";
import { AdminLeaveManagementController } from "Presentation/controllers/leave/admin.leave.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { UpdateLeaveStatusRequestSchema } from "application/dto/leave/admin/update-status.dto";
import { FetchAllLeaveQuerySchema } from "application/dto/leave/shared/leave-requests.dto";

const router = express.Router();
const ctrl = container.resolve(AdminLeaveManagementController);


router.get('/metrics', ctrl.getLeaveMetrics);

router.get(
  '/history',
  validateRequest(FetchAllLeaveQuerySchema, "query"),
  ctrl.getLeaveRequestsHistory
);

router.patch(
  '/update-status',
  validateRequest(UpdateLeaveStatusRequestSchema),
  ctrl.updateLeaveStatus
);


router.get('/export-report', ctrl.exportLeaveReport);

export default router;