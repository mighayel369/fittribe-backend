
import { ILeave } from "../models/LeaveModel";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { TrainerMapper } from "./TrainerMapper";

export const LeaveMapper = {
  toEntity(doc: ILeave): LeaveEntity {
    return new LeaveEntity(
      doc.leaveId,
      typeof doc.trainer === 'object' && doc.trainer !== null && 'name' in doc.trainer
        ? TrainerMapper.toEntity(doc.trainer as any)
        : (doc.trainer as string),
      doc.type,
      doc.start, 
      doc.end,
      doc.days,
      doc.reason,
      doc.status,
      doc.documents,
      doc.adminComment,
    );
  }
};