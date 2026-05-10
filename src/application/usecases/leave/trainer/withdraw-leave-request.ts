import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { IWithdrawLeaveRequest } from "application/interfaces/leave/i-withdraw-leave-request";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class WithdrawLeaveRequest implements IWithdrawLeaveRequest {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo
  ) { }


  async execute(leaveId: string): Promise<void> {
    const leaveEntity = await this._leaveRepository.getLeaveById(leaveId);

    if (!leaveEntity) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    leaveEntity.withdraw();

    await this._leaveRepository.updateLeaveData(leaveEntity);
  }
}