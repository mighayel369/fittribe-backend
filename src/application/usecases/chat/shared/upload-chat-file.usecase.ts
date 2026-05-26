import { IUploadChatFiles } from "application/interfaces/chat/i-upload-files";
import { inject, injectable } from "tsyringe";
import { ICloudinaryService, I_CLOUDINARY_SERVICE_TOKEN } from "domain/services/ICloudinaryService";
import { UploadChatFileResponseDTO, UploadChatFileResponseSchema } from "application/dto/chat/shared/upload-chat-file.response.dto";

@injectable()
export class UploadChatFile implements IUploadChatFiles {

    constructor(
        @inject(I_CLOUDINARY_SERVICE_TOKEN)
        private readonly _cloudinaryService: ICloudinaryService
    ) { }

    async upload(file: Express.Multer.File): Promise<UploadChatFileResponseDTO> {

        const uploadedFile = await this._cloudinaryService.uploadChatFile(file);

        return UploadChatFileResponseSchema.parse(
            uploadedFile
        );
    }
}