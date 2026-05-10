import { inject, injectable } from "tsyringe";
import { ITrainerLeaveMetrics } from "application/interfaces/leave/i-trainer-leave-metrics";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { TrainerLeaveMetrics } from "application/dto/leave/leave-metrics.dto";
import { LeaveMapper } from "application/mappers/leave-mapper";

@injectable()
export class GetTrainerLeaveMetrics implements ITrainerLeaveMetrics {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerLeaveMetrics[]> {

    const trainerUsageData = await this._leaveRepository.getTrainerLeaveCounts(trainerId);

    return LeaveMapper.toTrainerLeaveMetrics(trainerUsageData);
  }
}