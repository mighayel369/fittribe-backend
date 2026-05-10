import express from "express";
import { container } from "tsyringe";
import { AdminDashboardController } from "Presentation/controllers/dashboard/admin.dashboard.controller";

const router = express.Router();
const ctrl = container.resolve(AdminDashboardController);

router.get('/overview', ctrl.getPlatformInsights);

router.get('/export-report', ctrl.exportDashboardReport);

export default router;