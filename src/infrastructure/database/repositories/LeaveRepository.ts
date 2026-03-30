
import { injectable } from "tsyringe";
import Leave, { ILeave } from "../models/LeaveModel";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { LeaveMapper } from "../mappers/LeaveMapper";
import { BaseRepository } from "./BaseRepository";
import { LEAVE_STATUS } from "utils/Constants";
import { TrainerEntity } from "domain/entities/TrainerEntity";

@injectable()
export class LeaveRepository extends BaseRepository<ILeave, LeaveEntity> implements ILeaveRepo {
  protected model = Leave;
  protected toEntity = LeaveMapper.toEntity;

  async getAllLeaveRequests(): Promise<LeaveEntity[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).populate('trainer');
    return docs.map(doc => this.toEntity(doc));
  }

    async getAllTrainerLeaveRequests(id:string): Promise<LeaveEntity[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).populate('trainer');
    return docs.map(doc => this.toEntity(doc));
  }

  async checkOverlap(trainerId: string, start: Date, end: Date): Promise<boolean> {
    const conflict = await this.model.findOne({
      trainer: trainerId,
      status: { $ne: LEAVE_STATUS.REJECTED },
      $or: [
        { start: { $lte: end }, end: { $gte: start } }
      ]
    });
    
    return !!conflict;
  }

  async updateLeaveStatus(leaveId: string, status: LEAVE_STATUS, comment?: string): Promise<void> {
    await this.model.updateOne(
      { leaveId },
      { $set: { status, adminComment: comment } }
    );
  }

  async applyLeave(data:TrainerEntity):Promise<void>{
    await this.model.create(data)
  }
}