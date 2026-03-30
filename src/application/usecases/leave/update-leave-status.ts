import { UpdateLeaveStatusRequestDTO } from "application/dto/leave/update-status.dto";
import { IUpdateLeaveStatus } from "application/interfaces/leave/i-update-leave-status";
import { inject,injectable } from "tsyringe";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateLeaveStatus implements IUpdateLeaveStatus {
  constructor(
    @inject("LeaveRepository") private _leaveRepo: ILeaveRepo
  ) {}

  async execute(input: UpdateLeaveStatusRequestDTO): Promise<void> {
    const { leaveId, status, adminComment } = input;

    const existingLeave = await this._leaveRepo.getLeaveById(leaveId);
    if (!existingLeave) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND,HttpStatus.NOT_FOUND);
    }

    existingLeave.updateStatus(status, adminComment);

    await this._leaveRepo.updateLeaveData(existingLeave);
  }
}