import { UploadChatFileResponseDTO } from "application/dto/chat/shared/upload-chat-file.response.dto";
export const I_UPLOAD_CHAT_FILES = Symbol("I_UPLOAD_CHAT_FILES");

export interface IUploadChatFiles<TFile = Express.Multer.File> {
    upload(file: TFile): Promise<UploadChatFileResponseDTO>;
}