import express from "express";
import { container } from "tsyringe";
import { TrainerDashboardController } from "presentation/controllers/dashboard/trainer.dashboard.controller";
const router = express.Router();
const ctrl = container.resolve(TrainerDashboardController);

router.get('/metrics', ctrl.getPerformanceMetrics);

router.get('/agenda', ctrl.getDailyAgenda);

export default router;