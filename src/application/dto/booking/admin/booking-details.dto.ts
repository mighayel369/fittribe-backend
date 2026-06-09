import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PAYMENT_METHOD,PAYMENT_STATUS } from "domain/constants/payment-status";

export const AdminBookingDetailsResponseSchema = z.object({
    bookingId: z.string(),
    scheduledDate: z.string(),
    scheduledTime: z.number(),
    duration: z.number(),
    sessionType: z.string(),
    bookingStatus: z.enum(BOOKING_STATUS),
    bookedProgram: z.string(),

    payment: z.object({
        baseRate: z.number(),
        platformFee: z.number(),
        totalAmount: z.number(),
        paymentType: z.enum(PAYMENT_METHOD),
        paymentId: z.string(),
        status: z.enum(PAYMENT_STATUS),
    }),

    client: z.object({
        name: z.string(),
        email: z.email(),
        clientId: z.string(),
        totalSessions: z.number(),
        joinedOn: z.string(),
        profilePic: z.string()
    }),

    trainer: z.object({
        name: z.string(),
        trainerId: z.string(),
        rating: z.number(),
        experience: z.string(),
        profilePic: z.string()
    })
});

export type AdminBookingDetailsResponseDTO = z.infer<typeof AdminBookingDetailsResponseSchema>;