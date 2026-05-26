import express from "express";
import { container } from "tsyringe";
import { ProgramsManagementController } from "Presentation/controllers/management/programs.mgmt";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { OnboardProgramBodySchema, ProgramPictureFileSchema } from "application/dto/management/programs-management/onboard-new-program.dto";
import { ModifyProgramBodySchema } from "application/dto/management/programs-management/modify-program-sepcs.dto";
import { ProgramIdSchema } from "application/dto/management/programs-management/program-id-param.dto";
import { ToggleProgramVisibilityRequestSchema } from "application/dto/management/programs-management/toggle-program-visibility.dto";
import { FetchProgramsQuerySchema } from "application/dto/management/programs-management/fetch-all-programs.request.dto";
const router = express.Router();
const ctrl = container.resolve(ProgramsManagementController);



router.get('/inventory', validateRequest(FetchProgramsQuerySchema, "query"), ctrl.getAdminProgramInventory);


router.get('/:programId', validateRequest(ProgramIdSchema, 'params'), ctrl.getProgramFullDetails);
router.delete('/:programId', validateRequest(ProgramIdSchema, 'params'), ctrl.archiveProgram);


router.post('/onboard', upload.single('programPic'), validateRequest(ProgramPictureFileSchema, 'file'), validateRequest(OnboardProgramBodySchema), ctrl.onboardNewProgram);
router.patch('/specs', upload.single('programPic'), validateRequest(ProgramPictureFileSchema, 'file'), validateRequest(ModifyProgramBodySchema), ctrl.modifyProgramSpecifications);
router.patch('/visibility', validateRequest(ToggleProgramVisibilityRequestSchema), ctrl.toggleProgramVisibility);
export default router;