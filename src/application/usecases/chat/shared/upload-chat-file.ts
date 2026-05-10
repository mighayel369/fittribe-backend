import { IUploadChatFiles } from "application/interfaces/chat/i-upload-files";
import { inject, injectable } from "tsyringe";
import { ICloudinaryService, I_CLOUDINARY_SERVICE_TOKEN } from "domain/services/ICloudinaryService";


@injectable()
export class UploadChatFile implements IUploadChatFiles {
    constructor(
        @inject(I_CLOUDINARY_SERVICE_TOKEN)
        private readonly _cloudinaryService: ICloudinaryService
    ) { }

    async upload(file: Express.Multer.File): Promise<{ url: string; resource_type: string }> {
        return await this._cloudinaryService.uploadChatFile(file);
    }
}