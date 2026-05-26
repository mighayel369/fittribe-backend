import { UpdateUserProfileRequestDTO } from "application/dto/account/user/update-user-profile.dto";
export const I_UPDATE_USER_PROFILE_TOKEN = Symbol("I_UPDATE_USER_PROFILE_TOKEN");


export interface IUpdateUserProfileUseCase {
    execute(userId: string, profileData: UpdateUserProfileRequestDTO): Promise<void>;
}