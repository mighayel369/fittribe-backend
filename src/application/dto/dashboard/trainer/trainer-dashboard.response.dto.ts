import z from 'zod'
import { PendingActionsSchema } from './trainer-pending-actions.dto';
import { TrainerMonthlyPerformanceSchema } from './trainer-performance-data.dto';
import { ChatListResponseSchema } from 'application/dto/chat/shared/chat-list-response.dto';
export const TrainerDashboardResponseSchema = z.object({
    metrics: z.object({
        monthlyEarning: z.number(),
        upcomingTotal: z.number(),
        todayProgress: z.string(),
        averageRating: z.number()
    }),

    pendingActions: z.array(
        PendingActionsSchema
    ),

    performanceData: z.array(
        TrainerMonthlyPerformanceSchema
    ),

    recentChats: z.array(
        ChatListResponseSchema
    )
});

export type TrainerDashboardResponseDTO =
    z.infer<typeof TrainerDashboardResponseSchema>;