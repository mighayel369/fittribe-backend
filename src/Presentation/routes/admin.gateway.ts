import express from 'express';
import { UserRole } from 'utils/Constants';
import { authorizeRoles } from 'Presentation/middleware/authMiddleware';
import adminAuth from './auth/admin.auth'
import securityAuth from './auth/security.auth'
import sessionAuth from './auth/session.auth'
import adminManagement from './management/admin.management';
import userManagement from './management/user.management';
import programManagement from './management/programs.management';
import trainerManagement from './management/trainer.management';
import wallet from './payment/wallet';
import notification from './notification/notification.route'

const adminRouter = express.Router();

adminRouter.use('/auth',adminAuth)
adminRouter.use('/auth',sessionAuth)

adminRouter.use(authorizeRoles(UserRole.ADMIN));

adminRouter.use('/auth/security',securityAuth)

adminRouter.use('/platform', adminManagement);
adminRouter.use('/users', userManagement);
adminRouter.use('/programs', programManagement);
adminRouter.use('/trainers', trainerManagement);

adminRouter.use('/wallet', wallet);

adminRouter.use('/notification',notification)

export default adminRouter;