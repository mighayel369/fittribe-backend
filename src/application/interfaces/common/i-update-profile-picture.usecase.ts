import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";

export const I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN = Symbol("I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN");
export const I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN = Symbol("I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN");
export interface IUpdateProfilePicture{
    execute(input:UpdateProfilePictureRequestDTO):Promise<string>
}