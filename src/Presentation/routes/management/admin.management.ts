import express from "express";
import { container } from "tsyringe";
import { AdminManagementController } from "Presentation/controllers/management/admin.mgmt";
import { updateLeaveStatusSchema,adminQuerySchema } from "Presentation/validators/admin-mngmnt-schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";
const router = express.Router();
const ctrl = container.resolve(AdminManagementController);
router.get('/platform-overview', ctrl.getPlatformInsights);
router.get('/leave-metrics', ctrl.getLeaveMetrics);
router.get('/history', validateRequest(adminQuerySchema, "query"), ctrl.getLeaveRequestsHistory);
router.patch(
  '/update-status/:id', 
  validateRequest(updateLeaveStatusSchema), 
  ctrl.updateLeaveStatus
);

router.get('/export-leave-report',ctrl.exportLeaveReport)

router.get('/export-report',ctrl.exportDashboardReport)
export default router;