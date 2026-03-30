import { ITrainerLeaveMetrics } from "application/interfaces/leave/i-trainer-leave-metrics";
import { inject,injectable } from "tsyringe";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { TrainerLeaveMetrics } from "application/dto/leave/leave-metrics.dto";
import { LeaveMapper } from "application/mappers/leave-mapper";
@injectable()
export class GetTrainerLeaveMetrics implements ITrainerLeaveMetrics {
    constructor(  
        @inject("LeaveRepository") private _leaveRepo: ILeaveRepo
    ) {}

    async execute(trainerId: string): Promise<TrainerLeaveMetrics[]> {
        const rawData = await this._leaveRepo.getTrainerLeaveCounts(trainerId);

        return LeaveMapper.toTrainerLeaveMetrics(rawData);
    }
}