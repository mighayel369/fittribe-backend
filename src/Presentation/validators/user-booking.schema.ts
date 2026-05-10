import { z } from 'zod';
export const checkoutSchema = z.object({
    razorpay_order_id: z.string().min(1, "Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Payment ID is required"),
    razorpay_signature: z.string().min(1, "Signature is required"),

    trainerId: z.string().min(1, "Trainer ID is required"),
    program: z.string().min(1, "Program name is required"),

    date: z.coerce.date().refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }, {
        message: "Booking date cannot be in the past",
    }),

    time: z.number().int().min(0, "Invalid time slot"),
    price: z.number().positive("Price must be greater than 0"),
});


export const userRescheduleSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),

    newDate: z.coerce.date().refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }, {
        message: "New date cannot be in the past",
    }),

    newTimeSlot: z.number().int().min(0, "Invalid time slot"),

    reason: z.string()
        .trim()
        .min(3, "Reason must be at least 3 characters")
        .max(500, "Reason is too long")
});

export const userBookingQuerySchema = z.object({
    pageNo: z.coerce.number().min(1).default(1),
    search: z.string().optional().default(""),
});

