
import { inject, injectable } from "tsyringe";
import { I_LEAVE_REPO_TOKEN, ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { IWithdrawLeaveRequest } from "application/interfaces/leave/i-withdraw-leave-request";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";


@injectable()
export class WithdrawLeaveRequest implements IWithdrawLeaveRequest {
    constructor(
        @inject(I_LEAVE_REPO_TOKEN) private _leaveRepo: ILeaveRepo
    ) { }

    async execute(leaveId: string): Promise<void> {
        const existingLeave = await this._leaveRepo.getLeaveById(leaveId);
        
        if (!existingLeave) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

            existingLeave.withdraw();
            await this._leaveRepo.updateLeaveData(existingLeave);
    }
}