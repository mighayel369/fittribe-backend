export const I_CLOUDINARY_SERVICE_TOKEN = Symbol("I_CLOUDINARY_SERVICE_TOKEN");

export interface ICloudinaryService{
    getTrainerCertificateUrl(file:Express.Multer.File,email:string):Promise<string>
    getProfilePictureUrl(file:Express.Multer.File,id:string):Promise<string>
    getProgramImageUrl(file:Express.Multer.File,id:string):Promise<string>
    getLeaveRequestDocumentsUrl(file:Express.Multer.File,trainer:string):Promise<string>
}