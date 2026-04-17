import express from "express";
import { container } from "tsyringe";
import { ProgramsManagementController } from "Presentation/controllers/management/programs.mgmt";
import { upload } from "Presentation/middleware/upload"; 
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { onboardProgramSchema,modifyProgramSchema,inventoryQuerySchema,toggleVisibilitySchema,ProgramIdSchema } from "Presentation/validators/program-mgmt.schema";
const router = express.Router();
const ctrl = container.resolve(ProgramsManagementController);



router.get('/inventory', validateRequest(inventoryQuerySchema, "query"), ctrl.getAdminProgramInventory);


router.get('/:programId',validateRequest(ProgramIdSchema,'params'), ctrl.getProgramFullDetails);
router.delete('/:programId',validateRequest(ProgramIdSchema,'params'), ctrl.archiveProgram);


router.post('/onboard', upload.single('programPic'), validateRequest(onboardProgramSchema), ctrl.onboardNewProgram);
router.patch('/specs', upload.single('programPic'), validateRequest(modifyProgramSchema), ctrl.modifyProgramSpecifications);
router.patch('/visibility', validateRequest(toggleVisibilitySchema), ctrl.toggleProgramVisibility);
export default router;