
export const I_UPLOAD_CHAT_FILES = Symbol("I_UPLOAD_CHAT_FILES");

export interface IUploadChatFiles {
    upload(file: Express.Multer.File): Promise<{ url: string, resource_type: string }>
}