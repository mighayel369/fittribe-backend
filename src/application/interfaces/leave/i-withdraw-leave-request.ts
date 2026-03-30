

export interface IWithdrawLeaveRequest{
    execute(leaveId:string):Promise<void>
}