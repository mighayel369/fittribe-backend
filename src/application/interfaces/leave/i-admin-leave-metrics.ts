import { IAdminLeaveDashboard } from "application/dto/leave/leave-metrics.dto";


export interface IGetAdminLeaveMetrics {
    execute(): Promise<IAdminLeaveDashboard>;
}