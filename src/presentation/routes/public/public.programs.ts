import express from "express";
import { container } from "tsyringe";
import { ProgramsDiscoveryController } from "presentation/controllers/discovery/programs.discovery.controller";
const router = express.Router();
const ctrl = container.resolve(ProgramsDiscoveryController);


router.get('/explore', ctrl.exploreActivePrograms);

export default router;
