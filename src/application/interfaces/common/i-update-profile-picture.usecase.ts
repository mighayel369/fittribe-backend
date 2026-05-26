import { ProfilePictureFileDTO, UpdateProfilePictureResponseDTO } from "application/dto/account/shared/update-avatar.dto";

export const I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN = Symbol("I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN");
export const I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN = Symbol("I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN");

export interface IUpdateProfilePicture {
    execute(ownerId: string, file: ProfilePictureFileDTO): Promise<UpdateProfilePictureResponseDTO>;
}