import { inject, injectable } from "tsyringe";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { IGetTrainerSlotConfigurationUseCase } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerSlotResponseDTO } from "application/dto/slot/trainer-slot-response.dto";
import { SlotMapper } from "application/mappers/slot-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class GetTrainerSlotConfigurationUseCase implements IGetTrainerSlotConfigurationUseCase {
  constructor(
    @inject(I_SLOT_REPO_TOKEN) private readonly _slotRepository: ISlotRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerSlotResponseDTO> {
    let slotEntity = await this._slotRepository.getTrainerSlot(trainerId);

    if (!slotEntity) {
      slotEntity = await this._slotRepository.createTrainerSlot(trainerId);
    }

    if (!slotEntity) {
      throw new AppError(ERROR_MESSAGES.FAILED_TO_INITIATE_SLOTS, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return SlotMapper.toTrainerSlotResponseDTO(slotEntity);
  }
}