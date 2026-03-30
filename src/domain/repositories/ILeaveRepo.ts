import { LeaveEntity } from "domain/entities/LeaveEntity";


export interface ILeaveRepo{
    getAllLeaveRequests():Promise<LeaveEntity[]>
}