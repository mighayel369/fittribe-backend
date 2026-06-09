import express from "express";
import { container } from "tsyringe";
import { AdminBookingController } from "presentation/controllers/booking/admin.booking.controller";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { BookingMetricsQuerySchema } from "application/dto/booking/admin/booking-dashboard.request.dto";
import { BookingParamsSchema } from "application/dto/booking/shared/fetch-booking-detaiils.request.dto";
import { FetchAllBookingQuerySchema } from "application/dto/booking/shared/fetch-all-bookings.request.dto";
const router = express.Router();
const ctrl = container.resolve(AdminBookingController);


router.get('/all', validateRequest(FetchAllBookingQuerySchema, 'query'), ctrl.getAllBookings)
router.get(
  '/booking-metrics',
  validateRequest(BookingMetricsQuerySchema, 'query'),
  ctrl.getBookingMetrics
);
router.get('/details/:bookingId', validateRequest(BookingParamsSchema, 'params'), ctrl.getBookingDetails)
export default router;