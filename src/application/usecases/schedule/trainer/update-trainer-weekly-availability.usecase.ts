import { inject, injectable } from "tsyringe";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { IUpdateTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { UpdateTrainerAvailabilityRequestDTO } from "application/dto/slot/update-trainer-availability.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateTrainerWeeklyAvailabilityUseCase implements IUpdateTrainerWeeklyAvailabilityUseCase {
  constructor(
    @inject(I_SLOT_REPO_TOKEN)
    private readonly _slotRepository: ISlotRepo
  ) { }

  async execute(updatePayload: UpdateTrainerAvailabilityRequestDTO): Promise<void> {
    const { trainerId, availability } = updatePayload;

    this.validateSlots(availability);

    await this._slotRepository.updateWeeklyAvailability(trainerId, availability);
  }

  private validateSlots(availability: UpdateTrainerAvailabilityRequestDTO["availability"]): void {
    const timeToMinutes = (time: string): number => {
      const [timePart, modifier] = time.split(" ");
      const [rawHours, minutes] = timePart.split(":").map(Number);

      const hours = modifier === "PM" && rawHours !== 12 ? rawHours + 12
        : modifier === "AM" && rawHours === 12 ? 0
          : rawHours;

      return hours * 60 + minutes;
    };

    for (const day in availability) {
      const slots = availability[day as keyof typeof availability];
      if (!slots || slots.length === 0) continue;

      const sorted = [...slots].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

      let prevEnd = -1;
      for (const slot of sorted) {
        const start = timeToMinutes(slot.start);
        const end = timeToMinutes(slot.end);

        if (slot.start >= slot.end) {
          throw new AppError(
            ERROR_MESSAGES.INVALID_SLOT_WINDOW(day, slot.start, slot.end),
            HttpStatus.BAD_REQUEST
          );
        }
        if (start < prevEnd) {
          throw new AppError(
            ERROR_MESSAGES.OVERLAPPING_AVAILABILITY(day),
            HttpStatus.BAD_REQUEST
          );
        }
        prevEnd = end;
      }
    }
  }
}