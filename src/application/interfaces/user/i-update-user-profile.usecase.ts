import { UserProfileUpdateRequestDTO } from "application/dto/user/update-user-profile.dto";

export const I_UPDATE_USER_PROFILE_TOKEN = Symbol("I_UPDATE_USER_PROFILE_TOKEN");


export interface IUpdateUserProfileUseCase{
    execute(input:UserProfileUpdateRequestDTO):Promise<void>
}