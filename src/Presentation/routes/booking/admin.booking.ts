import express from "express";
import { container } from "tsyringe";
import { AdminBookingController } from "Presentation/controllers/booking/admin.booking.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { bookingIdSchema,bookingMetricsSchema } from "Presentation/validators/booking.mngmnt.schema";
const router = express.Router();
const ctrl = container.resolve(AdminBookingController);


router.get('/all',ctrl.getAllBookings)
router.get(
  '/booking-metrics',
  validateRequest(bookingMetricsSchema, 'query'), 
  ctrl.getBookingMetrics
);
router.get('/details/:bookingId',validateRequest(bookingIdSchema,'params'),ctrl.getBookingDetails)
export default router;