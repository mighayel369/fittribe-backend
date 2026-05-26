import { z } from "zod";

export const ProfilePictureFileSchema =
  z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
      (type) =>
        [
          "image/jpeg",
          "image/png",
          "image/webp"
        ].includes(type), {
      message: "Only JPEG, PNG, and WEBP image formats are allowed"
    }),
    size: z.number().max(5 * 1024 * 1024, { message: "Profile image size cannot exceed 5MB" }),
    buffer: z.instanceof(Buffer, { message: "Invalid file buffer stream" })
  });

export type ProfilePictureFileDTO = z.infer<typeof ProfilePictureFileSchema>;

export const UpdateProfilePictureResponseSchema =
  z.object({
    imageUrl: z.url()
  });

export type UpdateProfilePictureResponseDTO = z.infer<typeof UpdateProfilePictureResponseSchema>;