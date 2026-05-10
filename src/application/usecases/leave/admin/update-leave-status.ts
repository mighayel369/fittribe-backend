import { inject, injectable } from "tsyringe";
import { UpdateLeaveStatusRequestDTO } from "application/dto/leave/update-status.dto";
import { IUpdateLeaveStatus } from "application/interfaces/leave/i-update-leave-status";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateLeaveStatus implements IUpdateLeaveStatus {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo
  ) { }


  async execute(updatePayload: UpdateLeaveStatusRequestDTO): Promise<void> {
    const { leaveId, status, adminComment } = updatePayload;

    const leaveEntity = await this._leaveRepository.getLeaveById(leaveId);

    if (!leaveEntity) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    leaveEntity.updateStatus(status, adminComment);

    await this._leaveRepository.updateLeaveData(leaveEntity);
  }
}