import { z } from "zod";

export const ReceiverParamsSchema =
    z.object({
        receiverId: z
            .string()
            .trim()
            .min(1, "Receiver id is required")
    });

export type ReceiverParamsDTO = z.infer<typeof ReceiverParamsSchema>;