import { WeeklyAvailability, TimeRange } from "./types/slot.types";
import { AppError } from "../errors/AppError";
import { HttpStatus } from "utils/HttpStatus";

export class SlotEntity {
  constructor(
    public readonly trainerId: string,
    public readonly weeklyAvailability: WeeklyAvailability
  ) { }
  public validateSlots(): void {
    Object.entries(this.weeklyAvailability).forEach(
      ([day, availability]) => {
        if (!availability.enabled) {
          return;
        }
        availability.slots.forEach(
          (slot: TimeRange) => {
            if (
              slot.start >= slot.end
            ) {
              throw new AppError(`${day}: slot start time must be before end time`, HttpStatus.BAD_REQUEST);
            }

            if (
              slot.start < 0 ||
              slot.end > 1440
            ) {
              throw new AppError(`${day}: invalid time range`, HttpStatus.BAD_REQUEST
              );
            }
          }
        );
      }
    );
  }
}