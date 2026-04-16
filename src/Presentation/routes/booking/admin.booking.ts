import express from "express";
import { container } from "tsyringe";
import { AdminBookingController } from "Presentation/controllers/booking/admin.booking.controller";
const router = express.Router();
const ctrl = container.resolve(AdminBookingController);


router.get('/all',ctrl.getAllBookings)
router.get('/booking-metrics',ctrl.getBookingMetrics)
router.get('/details/:id',ctrl.getBookingDetails)
export default router;