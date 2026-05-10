import { injectable } from "tsyringe";
import { FilterQuery, Model } from "mongoose";
import { IProgramRepo } from "domain/repositories/IProgramRepo";
import ProgramModel, { IProgram } from "../models/ProgramModel";
import { BaseRepository } from "./BaseRepository";
import { ProgramEntity } from "domain/entities/ProgramEntity";
import { IProgramFilters } from "domain/filters/IProgramFilters";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";


@injectable()
export class ProgramRepoImpl
  extends BaseRepository<IProgram>
  implements IProgramRepo {
  protected model: Model<IProgram> = ProgramModel;

  private buildProgramMatchQuery(filters: IProgramFilters): FilterQuery<IProgram> {
    const { search, ...otherFilters } = filters;

    const query: FilterQuery<IProgram> = {
      ...otherFilters,
      isArchived: false,
    };

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }

    return query;
  }

  async saveProgram(payload: ProgramEntity): Promise<void> {
    await this.model.create(payload);
  }

  async findProgramInventory(
    page: number,
    limit: number,
    filters: IProgramFilters
  ): Promise<{ data: ProgramEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;


    const matchQuery = this.buildProgramMatchQuery(filters);

    const results = await this.model.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const items = results[0]?.data || [];
    const total = results[0]?.totalCount[0]?.count || 0;

    return {
      data: items,
      totalCount: total
    };
  }


  async findProgramById(id: string): Promise<ProgramEntity | null> {
    const doc = await this.model.findOne({ programId: id, isArchived: false });
    return doc ? doc : null;
  }

  async updateProgramSpecs(
    data: Partial<ProgramEntity>
  ): Promise<ProgramEntity | null> {
    const { programId } = data;
    const doc = await this.model.findOneAndUpdate(
      { programId },
      { $set: data },
      { new: true, runValidators: true }
    );

    return doc ? doc : null;
  }

  async updateProgramVisibility(programId: string, status: boolean): Promise<ProgramEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { programId },
      { $set: { status } },
      { new: true }
    );
    return doc ? doc : null;
  }

  async archiveProgram(id: string): Promise<void> {
    const result = await this.model.findOneAndUpdate(
      { programId: id },
      { $set: { isArchived: true, status: false, archivedAt: new Date() } },
      { new: true }
    );

    if (!result) throw new AppError(ERROR_MESSAGES.PROGRAM_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async findPublishedPrograms(): Promise<ProgramEntity[]> {
    const docs = await this.model.find({ status: true, isArchived: false });
    return docs;
  }
}