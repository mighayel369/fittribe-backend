import { AdminDashbardResponseDTO } from "application/dto/dashboard/admin-dashboard.dto";

export const I_ADMIN_DASHBOARD_TOKEN = Symbol("I_ADMIN_DASHBOARD_TOKEN");

export interface IAdminDashboard{
    execute():Promise<AdminDashbardResponseDTO>
}