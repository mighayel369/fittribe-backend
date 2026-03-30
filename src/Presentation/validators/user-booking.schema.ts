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

    time: z.string().min(1, "Time slot is required"),
    price: z.number().positive("Price must be greater than 0"),
});


export const userRescheduleSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
    newDate: z.coerce.date().refine((date) => date.getTime() > Date.now(), {
        message: "New date must be in the future",
    }),
    newTimeSlot: z.object({
        start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time"),
        end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time"),
    }).refine((data) => data.end > data.start, {
        message: "End time must be after start time",
        path: ["end"]
    }),
});

export const userBookingQuerySchema = z.object({
    pageNo: z.coerce.number().min(1).default(1),
    search: z.string().optional().default(""),
});