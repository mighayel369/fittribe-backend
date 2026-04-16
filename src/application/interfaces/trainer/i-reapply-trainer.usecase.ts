import { ReapplyTrainerRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";

export const I_REAPPLY_TRAINER_TOKEN = Symbol("I_REAPPLY_TRAINER_TOKEN");

export interface IReapplyTrainer{
    execute(input:ReapplyTrainerRequestDTO):Promise<void>
}