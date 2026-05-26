import { z } from "zod";

export const CertificateFileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
        (type) =>
            [
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf"
            ].includes(type),
        {
            message:
                "Only JPEG, PNG, WEBP, and PDF files are allowed"
        }
    ),
    size: z.number().max(
        5 * 1024 * 1024,
        {
            message:
                "Certificate file size cannot exceed 5MB"
        }
    ),
    buffer: z.instanceof(Buffer)
});

export type CertificatePictureFile = z.infer<typeof CertificateFileSchema>;