import express from "express";
import { container } from "tsyringe";
import { TrainerBookingController } from "Presentation/controllers/booking/trainer.booking.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { acceptBookingSchema, bookingQuerySchema, rejectBookingSchema, trainerRescheduleSchema } from "Presentation/validators/trainer-booking-schema";
const router = express.Router();
const ctrl = container.resolve(TrainerBookingController);


router.get('/reschedule', ctrl.getRescheduleRequests);
router.get('/history', validateRequest(bookingQuerySchema, "query"), ctrl.getHistory);
router.get('/pending', validateRequest(bookingQuerySchema, "query"), ctrl.getPendingRequests);


router.patch('/reschedule/approve', ctrl.approveReschedule);
router.patch('/reschedule/reject', ctrl.rejectReschedule);
router.patch('/accept', validateRequest(acceptBookingSchema), ctrl.acceptBooking);
router.patch('/reject', validateRequest(rejectBookingSchema), ctrl.rejectBooking);
router.put('/reschedule', validateRequest(trainerRescheduleSchema), ctrl.rescheduleByTrainer);


router.get('/:bookingId', ctrl.getBookingDetails); 


export default router;