import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { IAdminLeaveDashboard } from "application/dto/leave/leave-metrics.dto";
import { IGetAdminLeaveMetrics } from "application/interfaces/leave/i-admin-leave-metrics";
import { LeaveMapper } from "application/mappers/leave-mapper";

@injectable()
export class GetAdminLeaveMetrics implements IGetAdminLeaveMetrics {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo
  ) { }
  async execute(): Promise<IAdminLeaveDashboard> {

    const rawCountData = await this._leaveRepository.getAllLeaveCount();

    return LeaveMapper.toAdminLeaveMetrics(rawCountData);
  }
}