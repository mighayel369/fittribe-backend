import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  SortOrder,
} from "mongoose";

export abstract class BaseRepository<TDocument extends Document> {
  protected abstract model: Model<TDocument>;

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create(data);
  }


  async findMany(
    filter: FilterQuery<TDocument> = {},
    page = 1,
    limit = 10,
    sort: { [key: string]: SortOrder } = { createdAt: -1 }
  ): Promise<{ data: TDocument[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.model.find(filter).sort(sort).limit(limit).skip(skip).exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      totalCount,
    };
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    return await this.model.findOne(filter).exec();
  }

  async update(
    id: string,
    data: UpdateQuery<TDocument>
  ): Promise<TDocument | null> {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).exec();
  }


  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}