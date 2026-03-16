import { LEAVE_TYPES,LEAVE_STATUS } from "utils/Constants";
import { TrainerEntity } from "./TrainerEntity";
export class LeaveEntity{
    constructor(
    public leaveId: string,
    public trainer: (TrainerEntity|string),
    public type:LEAVE_TYPES,
    public start: Date,
    public end: Date,
    public days:number,
    public reason:string,
    public status: LEAVE_STATUS,
    public documents?:string,
    public adminComment?:string,
    public createdAt?:string
   ){}
}