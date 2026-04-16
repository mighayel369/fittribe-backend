
import { injectable } from "tsyringe";
import Leave, { ILeave } from "../models/LeaveModel";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { LeaveMapper } from "../mappers/LeaveMapper";
import { BaseRepository } from "./BaseRepository";
import { LEAVE_STATUS } from "utils/Constants";



@injectable()
export class LeaveRepository extends BaseRepository<ILeave, LeaveEntity> implements ILeaveRepo {
  protected model = Leave;
  protected toEntity = LeaveMapper.toEntity;

  async getAllLeaveRequests(search: string, filters: any, page: number, limit: number): Promise<{ data: LeaveEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const regex = new RegExp(search, "i");

    const matchQuery = {
      ...filters,
      $or: [
        { type: { $regex: regex } },
        { reason: { $regex: regex } }
      ]
    };

    const totalCount = await this.model.countDocuments(matchQuery);

    const docs = await this.model.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'trainers',
          localField: 'trainer',
          foreignField: 'trainerId',
          as: "trainerDetails"
        }
      },
      { $unwind: "$trainerDetails" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $addFields: { trainer: "$trainerDetails" } },
      { $project: { trainerDetails: 0 } }
    ]);

    return {
      data: docs.map(doc => this.toEntity(doc)),
      totalCount
    };
  }

  async requestLeave(data: LeaveEntity): Promise<void> {
    await this.model.create(data)
  }

async getTrainerLeaveCounts(trainerId: string): Promise<{ label: string, count: number }[]> {
    const currentYear = new Date().getFullYear();
    
    const startOfYear = new Date(currentYear, 0, 1);
    
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const counts = await this.model.aggregate([
        { 
            $match: { 
                trainer: trainerId, 
                status: {$in:[LEAVE_STATUS.APPROVED,LEAVE_STATUS.PENDING]},
                start: { 
                    $gte: startOfYear, 
                    $lte: endOfYear 
                }
            } 
        },
        { 
            $group: { 
                _id: "$type", 
                count: { $sum: "$days" } 
            } 
        },
        {
            $project: {
                _id: 0,       
                label: "$_id", 
                count: 1     
            }
        }
    ]);
    console.log(counts)
    return counts; 
}

async isTrainerOnLeave(trainerId: string, date: Date): Promise<boolean> {
    const startOfSelectedDate = new Date(date);
    startOfSelectedDate.setHours(0, 0, 0, 0);
  console.log(startOfSelectedDate)
    const endOfSelectedDate = new Date(date);
    endOfSelectedDate.setHours(23, 59, 59, 999);

    const activeLeave = await this.model.findOne({
        trainer: trainerId,
        status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] }, 
        start: { $lte: endOfSelectedDate }, 
        end: { $gte: startOfSelectedDate } 
    });

    return !!activeLeave;
}

async getAllLeaveCount(): Promise<{ approvalStatus: {label:string,count:number}[], leaveTypes: {label:string,count:number}[] }> {
  const [result] = await this.model.aggregate([
    {
      $facet: {
        approvalStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { _id: 0, label: "$_id", count: 1 } }
        ],
        leaveTypes: [
          {$match:{status:LEAVE_STATUS.APPROVED}},
          { $group: { _id: "$type", count: { $sum: "$days" } } },
          { $project: { _id: 0, label: "$_id", count: 1 } }
        ]
      }
    }
  ]);

  return {
    approvalStatus: result.approvalStatus || [],
    leaveTypes: result.leaveTypes || []
  };
}

async updateLeaveData(data:LeaveEntity): Promise<void> {

   await this.model.findOneAndUpdate(
    { leaveId:data.leaveId },
    { $set: data }
  );
}


async getLeaveById(leaveId: string): Promise<LeaveEntity | null> {
  console.log(leaveId)
    const doc = await this.model.findOne({ leaveId });
    console.log(doc)
    return doc ? this.toEntity(doc) : null;
}

async checkOverlap(trainerId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const conflict = await this.model.findOne({
        trainer: trainerId,
        status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] },
        start: { $lte: endDate },
        end: { $gte: startDate }
    });
    
    return !!conflict; 
}

async findLeaveReport(): Promise<LeaveEntity[]> {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const docs = await this.model.aggregate([
    {
      $match: {
        start: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: "trainers", 
        localField: "trainer",
        foreignField: "trainerId",
        as: "trainerDetails"
      }
    },
    { $unwind: "$trainerDetails" },
    {
      $addFields: {
        trainer: "$trainerDetails" 
      }
    }
  ]);

  return docs.map(doc => this.toEntity(doc));
}
}