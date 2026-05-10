import { WeeklyAvailability, TimeRange } from "./types/slot.types";
import { AppError } from "../errors/AppError";

export class SlotEntity {
  constructor(
    public readonly trainerId: string,
    public readonly weeklyAvailability: WeeklyAvailability,
  ) { }


  public isAvailable(day: keyof WeeklyAvailability, time: string): boolean {
    const daySlots = this.weeklyAvailability[day];
    return daySlots.some(slot => time >= slot.start && time < slot.end);
  }

  public validateSlots(): void {
    Object.values(this.weeklyAvailability).forEach((slots: TimeRange[]) => {
      slots.forEach(slot => {
        if (slot.start >= slot.end) {
          throw new AppError(`Invalid slot: ${slot.start} must be before ${slot.end}`, 400);
        }
      });
    });
  }
}