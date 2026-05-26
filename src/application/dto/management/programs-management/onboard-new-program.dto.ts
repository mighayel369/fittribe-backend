import { z } from "zod";

export const ProgramPictureFileSchema =
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
    size: z.number().max(5 * 1024 * 1024, { message: "Program image size cannot exceed 5MB" }),
    buffer: z.instanceof(Buffer, { message: "Invalid file buffer stream" })
  });

export type ProgramPictureFileDTO = z.infer<typeof ProgramPictureFileSchema>;

export const OnboardProgramBodySchema =
  z.object({
    name: z.string().trim().min(2, "Program name is required").max(
      20,
      "Program name is too long"
    ),
    description:
      z.string().trim().min(
        10,
        "Program description is required"
      )
        .max(
          1000,
          "Program description is too long"
        )
  });

export type OnboardProgramBodyDTO =  z.infer<typeof OnboardProgramBodySchema>;