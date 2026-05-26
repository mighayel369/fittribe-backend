import { inject, injectable } from "tsyringe";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { IUpdateTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { WeeklyAvailabilityDTO } from "application/dto/schedules/update-slot-config";
import { SlotEntity } from "domain/entities/SlotEntity";

@injectable()
export class UpdateTrainerWeeklyAvailabilityUseCase implements IUpdateTrainerWeeklyAvailabilityUseCase {
  constructor(
    @inject(I_SLOT_REPO_TOKEN) private readonly _slotRepository: ISlotRepo
  ) { }

  async execute(trainerId: string, availability: WeeklyAvailabilityDTO): Promise<void> {

    const slotEntity = new SlotEntity(trainerId, availability);
    slotEntity.validateSlots();
    await this._slotRepository.updateWeeklyAvailability(trainerId, availability);
  }
}