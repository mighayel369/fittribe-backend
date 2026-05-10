import { injectable } from "tsyringe";
import { ISlotRepo } from "domain/repositories/ISlotRepo";
import { BaseRepository } from "./BaseRepository";
import { SlotEntity } from "domain/entities/SlotEntity";
import { SlotModel, ISlot } from "../models/SlotModel";
import { Model } from "mongoose";

@injectable()
export class SlotRepoImpl extends BaseRepository<ISlot> implements ISlotRepo {
  protected model: Model<ISlot> = SlotModel;


  async getTrainerSlot(trainerId: string): Promise<SlotEntity | null> {
    return this.findOne({ trainerId });
  }
  async createTrainerSlot(trainerId: string): Promise<SlotEntity | null> {
    return this.create({
      trainerId: trainerId,
      weeklyAvailability: {
        monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: [], sunday: []
      }
    });
  }

  async updateWeeklyAvailability(trainerId: string, weeklyAvailability: SlotEntity["weeklyAvailability"]): Promise<void> {
    await this.model.findOneAndUpdate(
      { trainerId },
      { $set: { weeklyAvailability } },
    );
  }
}

