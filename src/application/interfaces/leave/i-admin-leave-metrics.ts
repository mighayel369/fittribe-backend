import { AdminLeaveDashboardDto } from "application/dto/leave/admin/leave-metrics.dto";

export const I_GET_ADMIN_LEAVE_METRICS_TOKEN = Symbol("I_GET_ADMIN_LEAVE_METRICS_TOKEN");

export interface IGetAdminLeaveMetrics {
    execute(): Promise<AdminLeaveDashboardDto>;
}