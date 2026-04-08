import express from "express";
import { container } from "tsyringe";
import { UserBookingController } from "Presentation/controllers/booking/user.booking.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { checkoutSchema,userRescheduleSchema,userBookingQuerySchema } from "Presentation/validators/user-booking.schema";
const router = express.Router();
const ctrl = container.resolve(UserBookingController);



router.get('/:id/details', ctrl.getBookingDetails);

router.delete('/:bookingId', ctrl.cancelSession);

router.get('/history', validateRequest(userBookingQuerySchema, "query"), ctrl.getBookings);

router.post('/checkout', validateRequest(checkoutSchema), ctrl.checkoutAndBook);
router.post('/reschedule', validateRequest(userRescheduleSchema), ctrl.requestReschedule);

router.patch('/:bookingId/reschedule/accept', ctrl.acceptReschedule);
router.patch('/:bookingId/reschedule/decline', ctrl.declineReschedule);
export default router;