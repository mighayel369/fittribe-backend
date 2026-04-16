import { UpdateTrainerProfileRequestDTO } from "application/dto/trainer/update-trainer-profile.dto"

export const I_UPDATE_TRAINER_PROFILE_TOKEN = Symbol("I_UPDATE_TRAINER_PROFILE_TOKEN");

export interface IUpdateTrainerProfileUseCase{
    execute(input:UpdateTrainerProfileRequestDTO):Promise<void>
}