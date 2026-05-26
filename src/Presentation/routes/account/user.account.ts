import express from "express";
import { container } from "tsyringe";
import { UserAccountController } from "Presentation/controllers/account/user.account.controller";
import { upload } from "Presentation/middleware/upload";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { ProfilePictureFileSchema } from "application/dto/account/shared/update-avatar.dto";
import { ChangePasswordRequestSchema } from "application/dto/account/shared/update-password.dto";
import { UpdateUserProfileRequestSchema } from "application/dto/account/user/update-user-profile.dto";
const router = express.Router();
const ctrl = container.resolve(UserAccountController);


router.get('/verify', ctrl.verifySession);

router.get('/me', ctrl.getProfile);

router.put(
  '/update',
  validateRequest(UpdateUserProfileRequestSchema),
  ctrl.updateProfile
);

router.patch('/avatar', upload.single('profilePic'),validateRequest(ProfilePictureFileSchema,'file'), ctrl.updateAvatar);
router.post('/change-password', validateRequest(ChangePasswordRequestSchema) ,ctrl.changePassword);
export default router;
