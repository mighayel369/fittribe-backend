import express from "express";
import { container } from "tsyringe";
import { LeaveController } from "Presentation/controllers/account/trainer.leave.controller";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { leaveHistorySchema,applyLeaveSchema ,withdrawLeaveSchema} from "Presentation/validators/trainer-leave.schema";
const router = express.Router();
const ctrl = container.resolve(LeaveController);

router.post(
    '/apply',
    upload.single('documents'),
    validateRequest(applyLeaveSchema),
    ctrl.applyForLeaveRequest
);

router.get(
    '/history',
    validateRequest(leaveHistorySchema, "query"),
    ctrl.getLeaveRequestsHistory
);

router.get('/metrics', ctrl.getLeaveMetrics);
router.patch(
    '/withdraw/:id', 
    validateRequest(withdrawLeaveSchema, "params"), 
    ctrl.withdrawLeaveRequest
);
export default router;