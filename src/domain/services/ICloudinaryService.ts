import { IMemoryUploadedFile } from "./types/upload-picture";

export const I_CLOUDINARY_SERVICE_TOKEN = Symbol("I_CLOUDINARY_SERVICE_TOKEN");

export interface ICloudinaryService {
    getTrainerCertificateUrl(file: IMemoryUploadedFile, email: string): Promise<string>
    getProfilePictureUrl(file: IMemoryUploadedFile, id: string): Promise<string>
    getProgramImageUrl(file: IMemoryUploadedFile, id: string): Promise<string>
    getLeaveRequestDocumentsUrl(file: IMemoryUploadedFile, trainer: string): Promise<string>
    uploadChatFile(file: IMemoryUploadedFile): Promise<{ url: string, resource_type: string }>
}