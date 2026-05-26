import { z } from "zod";

export const CheckoutBookingSchema = z.object({
    trainerId: z
        .string()
        .trim()
        .min(1),
    program: z
        .string()
        .trim()
        .min(1),
    date: z.string(),
    time: z.number(),
    price: z
        .number()
        .positive()
});

export type CheckoutBookingDTO =
    z.infer<typeof CheckoutBookingSchema>;