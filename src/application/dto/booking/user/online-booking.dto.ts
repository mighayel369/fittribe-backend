import { z } from "zod";
import { CheckoutBookingSchema } from "./checkout-booking.schema";
import { VerifyOnlinePaymentSchema } from "application/dto/payment/verify-online-payment.dto";

export const OnlineBookingRequestSchema =
    CheckoutBookingSchema.extend(
        VerifyOnlinePaymentSchema.shape
    );

export type OnlineBookingRequestBodyDTO =
    z.infer<typeof OnlineBookingRequestSchema>;