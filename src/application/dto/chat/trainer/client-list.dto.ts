import { z } from "zod";

export const NonEstablishedChatListResponseSchema =
    z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        profilePic: z.string()
    });

export const NonEstablishedChatListArraySchema = z.array(NonEstablishedChatListResponseSchema);

export type NonEstablishedChatListResponseDTO = z.infer<typeof NonEstablishedChatListResponseSchema>;