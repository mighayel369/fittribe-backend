
export interface TrainerLeaveMetrics{
    label:string,
    usedCount:number,
    totalCount:number
}

export interface AdminLeaveMetrics{
    label:string,
    count:number
}

export interface IAdminLeaveDashboard {
    approvalStatus: AdminLeaveMetrics[];
    leaveTypes: AdminLeaveMetrics[];
}