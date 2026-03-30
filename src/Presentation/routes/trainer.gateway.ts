import express from 'express';
import { UserRole } from 'utils/Constants';
import { authorizeRoles } from 'Presentation/middleware/authMiddleware';
import notification from './notification/notification.route'

import trainerAuth from './auth/trainer.auth';
import sessionAuth from './auth/session.auth';
import securityAuth from './auth/security.auth';
import wallet from './payment/wallet';
import trainerAccount from './account/trainer.account';
import trainerSchedule from './account/trainer.schedule';
import trainerDashboard from './account/trainer.dashboard';
import trainerLeaves from './account/trainer.leave'
import trainerBookings from './booking/trainer.bookings';
import publicPrograms from './public/public.programs';

const trainerRouter = express.Router();

trainerRouter.use('/discovery', publicPrograms); 
trainerRouter.use('/auth', trainerAuth);
trainerRouter.use('/auth', sessionAuth);


trainerRouter.use(authorizeRoles(UserRole.TRAINER));


trainerRouter.use('/auth/security', securityAuth); 

trainerRouter.use('/account', trainerAccount);
trainerRouter.use('/schedule', trainerSchedule);
trainerRouter.use('/dashboard', trainerDashboard);
trainerRouter.use('/leaves', trainerLeaves),

trainerRouter.use('/bookings', trainerBookings);
trainerRouter.use('/wallet', wallet);
trainerRouter.use('/notification',notification)
export default trainerRouter;