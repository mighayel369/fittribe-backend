import { z } from "zod";

export const AdminLeaveMetricSchema = z.object({
    label: z.string().trim().min(1),
    count: z.number().min(0)
});

export type AdminLeaveMetrics =
    z.infer<typeof AdminLeaveMetricSchema>;

export const AdminLeaveDashboardSchema = z.object({
    approvalStatus: z.array(AdminLeaveMetricSchema),
    leaveTypes: z.array(AdminLeaveMetricSchema)
});

export type AdminLeaveDashboardDto = z.infer<typeof AdminLeaveDashboardSchema>;
