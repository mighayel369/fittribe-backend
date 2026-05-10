import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import config from "config";
import { ICloudinaryService } from "domain/services/ICloudinaryService";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "utils/logger";

@injectable()
export class CloudinaryService implements ICloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: config.CLOUDINARY_CLOUD_NAME,
            api_key: config.CLOUDINARY_API_KEY,
            api_secret: config.CLOUDINARY_API_SECRET
        });
    }

    private formatFile(file: Express.Multer.File): string {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    }

    async getTrainerCertificateUrl(file: Express.Multer.File, email: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(this.formatFile(file), {
                folder: "trainer-certificates",
                public_id: `trainer-${email}`,
                overwrite: true
            });
            return result.secure_url;
        } catch (error) {
            logger.error("Cloudinary upload failed:", error);
            throw new AppError(ERROR_MESSAGES.UPLOAD_CERTIFICATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfilePictureUrl(file: Express.Multer.File, id: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(this.formatFile(file), {
                folder: "profile-pictures",
                public_id: `profile-${id}`,
                overwrite: true
            });
            return result.secure_url;
        } catch (error) {
            logger.error("Cloudinary profile upload failed:", error);
            throw new AppError(ERROR_MESSAGES.UPLOAD_PROFILE_PICTURE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProgramImageUrl(file: Express.Multer.File, program: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(this.formatFile(file), {
                folder: "program-images",
                public_id: `program-${program}-${Date.now()}`,
                overwrite: true
            });
            return result.secure_url;
        } catch (error) {
            logger.error("Cloudinary program image upload failed:", error);
            throw new AppError(ERROR_MESSAGES.UPLOAD_PROGRAM_IMAGE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getLeaveRequestDocumentsUrl(file: Express.Multer.File, trainer: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(this.formatFile(file), {
                folder: "leave-request-documents",
                public_id: `leave-${trainer}-${Date.now()}`,
                overwrite: true
            });
            return result.secure_url;
        } catch (error) {
            logger.error("Cloudinary leave doc upload failed:", error);
            throw new AppError(ERROR_MESSAGES.UPLOAD_LEAVE_DOCUMENT_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadChatFile(file: Express.Multer.File): Promise<{ url: string; resource_type: string }> {
        return new Promise((resolve, reject) => {
            let rType: "image" | "video" | "raw" = "raw";

            if (file.mimetype.startsWith("image/")) rType = "image";
            else if (file.mimetype.startsWith("video/")) rType = "video";


            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "chat-attachments",
                    resource_type: rType
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error || new AppError(ERROR_MESSAGES.UPLOAD_CHAT_ATTACHMENT_FAILED, HttpStatus.BAD_REQUEST));
                    }

                    resolve({
                        url: result.secure_url,
                        resource_type: rType
                    });
                }
            );

            uploadStream.end(file.buffer);
        });
    }
}