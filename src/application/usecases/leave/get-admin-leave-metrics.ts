
import { inject,injectable } from "tsyringe";
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { IAdminLeaveDashboard } from "application/dto/leave/leave-metrics.dto";
import { IGetAdminLeaveMetrics } from "application/interfaces/leave/i-admin-leave-metrics";
import { LeaveMapper } from "application/mappers/leave-mapper";
@injectable()
export class GetAdminLeaveMetrics implements IGetAdminLeaveMetrics {
    constructor(
        @inject("LeaveRepository") private _leaveRepo: ILeaveRepo
    ) {}

    async execute(): Promise<IAdminLeaveDashboard> {
        const rawData = await this._leaveRepo.getAllLeaveCount();

        return LeaveMapper.toAdminLeaveMetrics(rawData)
    }
}