import { z } from "zod";
import { CheckoutBookingSchema } from "../user/checkout-booking.schema";

export const OnlineBookingRequestSchema =
    CheckoutBookingSchema.extend({

        razorpay_order_id: z
            .string()
            .trim()
            .min(1, "Razorpay order id is required"),

        razorpay_payment_id: z
            .string()
            .trim()
            .min(1, "Razorpay payment id is required"),

        razorpay_signature: z
            .string()
            .trim()
            .min(1, "Razorpay signature is required")
    });

export type OnlineBookingRequestBodyDTO =
    z.infer<typeof OnlineBookingRequestSchema>;