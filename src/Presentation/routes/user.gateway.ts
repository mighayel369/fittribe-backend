import express from 'express';
import { UserRole } from 'utils/Constants';
import { authorizeRoles } from 'Presentation/middleware/authMiddleware';
import notification from './notification/notification.route'

import userAuth from './auth/user.auth';
import sessionAuth from './auth/session.auth';
import securityAuth from './auth/security.auth';
import wallet from './payment/wallet';
import userAccount from './account/user.account';
import userPayment from './payment/user.payment'; 
import userBookings from './booking/user.bookings';
import publicPrograms from './public/public.programs';
import publicTrainers from './public/public.trainers';

const userRouter = express.Router();

userRouter.use('/discovery', publicPrograms);
userRouter.use('/discovery/trainers', publicTrainers);
userRouter.use('/auth', userAuth);
userRouter.use('/auth', sessionAuth);

userRouter.use(authorizeRoles(UserRole.USER));


userRouter.use('/auth/security', securityAuth);
userRouter.use('/account', userAccount);
userRouter.use('/bookings', userBookings);
userRouter.use('/payments', userPayment); 
userRouter.use('/wallet', wallet);
userRouter.use('/notification',notification)
export default userRouter;