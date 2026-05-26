import { UpdateProfileDTO } from "application/dto/account/trainer/update-profile.dto";
export const I_UPDATE_TRAINER_PROFILE_TOKEN=Symbol("I_UPDATE_TRAINER_PROFILE_TOKEN")
export interface IUpdateTrainerProfileUseCase {
  execute(trainerId: string,data: UpdateProfileDTO): Promise<void>;
}