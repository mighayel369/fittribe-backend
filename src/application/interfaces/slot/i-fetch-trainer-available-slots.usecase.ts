import { FetchAvailableSlotResponseDTO, FetchAvailableSlotsRequestDTO } from "application/dto/slot/fetch-trainer-available-slots.dto";

export const I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN = Symbol("I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN");

export interface IFetchTrainerAvailableSlotsUseCase {
  execute(input: FetchAvailableSlotsRequestDTO): Promise<FetchAvailableSlotResponseDTO>;
}