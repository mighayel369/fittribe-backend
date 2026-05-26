
import { z } from "zod";
import { UserRole } from "domain/constants/user-role";

export const ClientSessionResponseSchema = z.object({
    name: z.string(),
    role: z.literal(UserRole.USER),
    profilePic: z.string(),
    status: z.boolean()
});

export type ClientSessionResponseDTO = z.infer<typeof ClientSessionResponseSchema>;