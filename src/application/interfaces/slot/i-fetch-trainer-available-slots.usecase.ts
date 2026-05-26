import { FetchAvailableSlotResponseDTO } from "application/dto/discovery/trainer-slots.dto";

export const I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN = Symbol("I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN");

export interface IFetchTrainerAvailableSlotsUseCase {
  execute(trainerId: string, date: string): Promise<FetchAvailableSlotResponseDTO>;
}