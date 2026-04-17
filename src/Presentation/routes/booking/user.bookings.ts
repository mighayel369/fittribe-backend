import express from "express";
import { container } from "tsyringe";
import { UserBookingController } from "Presentation/controllers/booking/user.booking.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { checkoutSchema,userRescheduleSchema,userBookingQuerySchema } from "Presentation/validators/user-booking.schema";
import { bookingIdSchema } from "Presentation/validators/booking.mngmnt.schema";
const router = express.Router();
const ctrl = container.resolve(UserBookingController);



router.get('/details/:bookingId',validateRequest(bookingIdSchema,'params'), ctrl.getBookingDetails);

router.delete('/:bookingId',validateRequest(bookingIdSchema,'params'), ctrl.cancelSession);

router.get('/history', validateRequest(userBookingQuerySchema, "query"), ctrl.getBookings);

router.post('/checkout', validateRequest(checkoutSchema), ctrl.checkoutAndBook);
router.post('/reschedule', validateRequest(userRescheduleSchema), ctrl.requestReschedule);

router.patch('/reschedule/accept/:bookingId', validateRequest(bookingIdSchema,'params'),ctrl.acceptReschedule);
router.patch('/reschedule/decline/:bookingId', validateRequest(bookingIdSchema,'params'),ctrl.declineReschedule);
export default router;