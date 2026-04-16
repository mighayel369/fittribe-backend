import express from "express";
import { container } from "tsyringe";
import { UserAccountController } from "Presentation/controllers/account/user.account.controller";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { updateUserProfileSchema } from "Presentation/validators/user-account.schema";
import { changePasswordSchema } from "Presentation/validators/auth.schema";
const router = express.Router();
const ctrl = container.resolve(UserAccountController);


router.get('/verify', ctrl.verifySession);

router.get('/me', ctrl.getProfile);

router.put(
    '/update', 
    validateRequest(updateUserProfileSchema), 
    ctrl.updateProfile
);

router.patch('/avatar', upload.single('profilePic'), ctrl.updateAvatar);
router.post(
  '/change-password',validateRequest(changePasswordSchema), ctrl.changePassword
);
export default router;
