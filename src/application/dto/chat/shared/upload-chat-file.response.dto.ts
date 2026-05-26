import { z } from "zod";

export const UploadChatFileResponseSchema = z.object({
    url: z.url(),
    resource_type: z.enum(["image", "video", "raw"])
});

export type UploadChatFileResponseDTO =
    z.infer<typeof UploadChatFileResponseSchema>;