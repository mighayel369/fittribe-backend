import { z } from "zod";

export const CreateOnlinePaymentSchema =
    z.object({
        trainerId: z.string().trim().min(1, "Trainer id is required"),
        programId: z.string().trim().min(1, "Program id is required"),
        date: z.string(),
        time: z.number({
            error: "Time slot is required"
        }),
        amount: z.number({
            error: "Amount is required"
        }).positive("Amount must be greater than 0")
    });

export type CreateOnlinePaymentRequestDTO =  z.infer<typeof CreateOnlinePaymentSchema>;