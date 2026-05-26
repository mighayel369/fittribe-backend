import express from "express";
import { container } from "tsyringe";
import { TrainerAccountController } from "Presentation/controllers/account/trainer.account.controller";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { updateProfileSchema } from "application/dto/account/trainer/update-profile.dto";
import { reapplyTrainerSchema } from "application/dto/auth/trainer/reapply-trainer.dto";

import { CertificateFileSchema } from "application/dto/auth/trainer/certificate-file.schema";
import { ProfilePictureFileSchema } from "application/dto/account/shared/update-avatar.dto";
import { ChangePasswordRequestSchema } from "application/dto/account/shared/update-password.dto";
const router = express.Router();
const ctrl = container.resolve(TrainerAccountController);


router.get('/me', ctrl.getProfile);
router.get('/verify', ctrl.verifySession);

router.patch('/avatar', upload.single('profilePic'), validateRequest(ProfilePictureFileSchema, 'file'), ctrl.updateAvatar);

router.put(
    '/profile',
    upload.none(),
    validateRequest(updateProfileSchema),
    ctrl.updateProfile
);

router.post(
    '/re-apply',
    upload.single('certificate'),
    validateRequest(reapplyTrainerSchema),
    validateRequest(CertificateFileSchema, 'file'),
    ctrl.reapply
);

router.post(
    '/change-password', validateRequest(ChangePasswordRequestSchema), ctrl.changePassword
);

export default router;
