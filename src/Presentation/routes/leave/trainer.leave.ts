import express from "express";
import { container } from "tsyringe";
import { LeaveController } from "Presentation/controllers/leave/trainer.leave.controller";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { LeaveDocumentFileSchema } from "application/dto/leave/shared/leave-document-file.dto";
import { RequestLeaveSchema } from "application/dto/leave/trainer/request.leave.dto";
import { LeaveParamsSchema } from "application/dto/leave/shared/leave-params.dto";
import { FetchAllLeaveQuerySchema } from "application/dto/leave/shared/leave-requests.dto";
const router = express.Router();
const ctrl = container.resolve(LeaveController);

router.post(
    '/apply',
    upload.single('documents'),
    validateRequest(LeaveDocumentFileSchema, 'file'),
    validateRequest(RequestLeaveSchema),
    ctrl.applyForLeaveRequest
);

router.get(
    '/history',
    validateRequest(FetchAllLeaveQuerySchema, "query"),
    ctrl.getLeaveRequestsHistory
);

router.get('/metrics', ctrl.getLeaveMetrics);
router.patch(
    '/withdraw/:leaveId',
    validateRequest(LeaveParamsSchema, "params"),
    ctrl.withdrawLeaveRequest
);
export default router;