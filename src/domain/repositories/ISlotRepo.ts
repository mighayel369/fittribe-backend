import { SlotEntity } from "domain/entities/SlotEntity";

export const I_SLOT_REPO_TOKEN = Symbol("I_SLOT_REPO_TOKEN");

export interface ISlotRepo {
  getTrainerSlot(trainerId: string): Promise<SlotEntity | null>;
  createTrainerSlot(trainerId: string): Promise<SlotEntity | null>;
  updateWeeklyAvailability(trainerId: string, weeklyAvailability: SlotEntity["weeklyAvailability"]): Promise<void>;
}
