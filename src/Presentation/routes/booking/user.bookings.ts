import express from "express";
import { container } from "tsyringe";
import { UserBookingController } from "Presentation/controllers/booking/user.booking.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { OnlineBookingRequestSchema } from "application/dto/booking/shared/book-trainer.request.dto";
import { BookingParamsSchema } from "application/dto/booking/shared/fetch-booking-detaiils.request.dto";
import { FetchAllBookingQuerySchema } from "application/dto/booking/shared/fetch-all-bookings.request.dto";
const router = express.Router();
const ctrl = container.resolve(UserBookingController);



router.get('/details/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.getBookingDetails);

router.delete('/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.cancelSession);

router.get('/history', validateRequest(FetchAllBookingQuerySchema, "query"), ctrl.getBookings);

router.post('/checkout', validateRequest(OnlineBookingRequestSchema), ctrl.checkoutAndBook);
router.post('/reschedule', validateRequest(FetchAllBookingQuerySchema), ctrl.requestReschedule);

router.patch('/reschedule/accept/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.acceptReschedule);
router.patch('/reschedule/decline/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.declineReschedule);
export default router;