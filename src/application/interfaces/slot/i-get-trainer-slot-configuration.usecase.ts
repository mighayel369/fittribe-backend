import { SlotEntity } from "domain/entities/SlotEntity";

export const I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN = Symbol("I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN");

export interface IGetTrainerSlotConfigurationUseCase {
  execute(trainerId: string): Promise<SlotEntity>;
}