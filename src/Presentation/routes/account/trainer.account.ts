import express from "express";
import { container } from "tsyringe";
import { TrainerAccountController } from "Presentation/controllers/account/trainer.account.controller";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { updateTrainerProfileSchema } from "Presentation/validators/trainer-account.schema";
import { reapplyTrainerSchema } from "Presentation/validators/trainer-account.schema";
const router = express.Router();
const ctrl = container.resolve(TrainerAccountController );


router.get('/me', ctrl.getProfile);
router.get('/verify', ctrl.verifySession);

router.patch('/avatar', upload.single('profilePic'), ctrl.updateAvatar);

router.put(
    '/profile', 
    upload.none(), 
    validateRequest(updateTrainerProfileSchema), 
    ctrl.updateProfile
);

router.post(
    '/re-apply', 
    upload.single('certificate'), 
    validateRequest(reapplyTrainerSchema), 
    ctrl.reapply
);

export default router;
