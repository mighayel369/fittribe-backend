import express from "express";
import { container } from "tsyringe";
import { TrainerBookingController } from "presentation/controllers/booking/trainer.booking.controller";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { BookingParamsSchema, RejectBookingBodySchema } from "application/dto/booking/shared/fetch-booking-detaiils.request.dto";
import { RescheduleRequestSchema } from "application/dto/booking/shared/reschedule-request.dto";
import { FetchAllBookingQuerySchema } from "application/dto/booking/shared/fetch-all-bookings.request.dto";
const router = express.Router();
const ctrl = container.resolve(TrainerBookingController);


router.get('/reschedule',validateRequest(FetchAllBookingQuerySchema, "query"), ctrl.getRescheduleRequests);
router.get('/history', validateRequest(FetchAllBookingQuerySchema, "query"), ctrl.getHistory);
router.get('/pending', validateRequest(FetchAllBookingQuerySchema, "query"), ctrl.getPendingRequests);


router.patch('/reschedule/approve/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.approveReschedule);
router.patch('/reschedule/reject/bookingId', validateRequest(BookingParamsSchema, 'params'), validateRequest(RejectBookingBodySchema), ctrl.rejectReschedule);
router.patch('/accept/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.acceptBooking);
router.patch('/reject:bookingId', validateRequest(BookingParamsSchema, 'params'), validateRequest(RejectBookingBodySchema), ctrl.rejectBooking);

router.put('/reschedule', validateRequest(RescheduleRequestSchema), ctrl.rescheduleByTrainer);


router.get('/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.getBookingDetails);

router.patch('/mark-as-complete/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.markAsComplete)

export default router;