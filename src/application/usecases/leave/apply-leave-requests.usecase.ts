import { ApplyLeaveRequestDTO } from "application/dto/leave/apply-leave.dto";
import { IApplyLeaveRequest } from "application/interfaces/leave/i-apply-leave-requests.usecase";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { inject,injectable } from "tsyringe";


@injectable()
export class ApplyLeaveRequests implements IApplyLeaveRequest{
    constructor(@inject("LeaveRepository") private  _ILeaveRepo:ILeaveRepo){}
    execute(input: ApplyLeaveRequestDTO): Promise<void> {
        
    }
}