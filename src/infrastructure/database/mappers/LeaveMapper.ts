// mappers/LeaveMapper.ts
import { ILeave } from "../models/LeaveModel";
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { TrainerMapper } from "./TrainerMapper";

export const LeaveMapper = {
  toEntity(doc: ILeave): LeaveEntity {
    return new LeaveEntity(
      doc.leaveId,
      TrainerMapper.toEntity(doc.trainer as any),
      doc.type,
      doc.start, 
      doc.end,
      doc.reason,
      doc.status,
      doc.documents,
      doc.adminComment
    );
  }
};