export const I_WITHDRAW_LEAVE_REQUEST_TOKEN = Symbol("I_WITHDRAW_LEAVE_REQUEST_TOKEN");

export interface IWithdrawLeaveRequest{
    execute(leaveId:string):Promise<void>
}