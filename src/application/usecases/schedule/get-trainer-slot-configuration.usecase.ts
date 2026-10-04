import { inject, injectable } from "tsyringe";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { IGetTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-get-trainer-weekly-availability.usecase";
import { TrainerWeeklyAvailabilityResponseDTO } from "application/dto/schedules/get-trainer-weekly-availability.dto";
import { SlotMapper } from "application/mappers/slot-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class GetTrainerWeeklyAvailabilityUseCase implements
  IGetTrainerWeeklyAvailabilityUseCase {
  constructor(
    @inject(I_SLOT_REPO_TOKEN) private readonly _slotRepository: ISlotRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerWeeklyAvailabilityResponseDTO> {

    let slot = await this._slotRepository.getTrainerSlot(trainerId);

    if (!slot) {
      slot = await this._slotRepository.createTrainerSlot(trainerId);
    }

    if (!slot) {
      throw new AppError(ERROR_MESSAGES.FAILED_TO_INITIATE_SLOTS, HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return SlotMapper.toWeeklyAvailabilityResponseDTO(slot);
  }
}