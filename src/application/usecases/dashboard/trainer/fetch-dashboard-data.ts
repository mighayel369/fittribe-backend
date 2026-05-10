import { inject, injectable } from "tsyringe";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { AppError } from "domain/errors/AppError";

import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { DashboardMapper } from "application/mappers/dashboard-mapper";
import { ChatMapper } from "application/mappers/chat-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class TrainerDashboardUsecase implements ITrainerDashBoard {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
    @inject(I_TRAINER_REPO_TOKEN) private _trainerRepo: ITrainerRepo,
    @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerDashboardResponseDTO> {
    const trainer = await this._trainerRepo.findTrainerById(trainerId);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const now = new Date();

    const [earnings, pending, progress, performance, upcomingTotal, chatList] = await Promise.all([
      this._bookingRepo.getMonthlyEarnings(trainerId, now.getMonth(), now.getFullYear()),
      this._bookingRepo.getPendingActions(trainerId),
      this._bookingRepo.getTodayProgress(trainerId),
      this._bookingRepo.getPerformanceData(trainerId),
      this._bookingRepo.findUpcomingBookingCount(trainerId),
      this._chatRepo.getChatListForTrainer(trainerId)
    ]);
    return {
      metrics: {
        monthlyEarning: earnings,
        upcomingTotal: upcomingTotal,
        todayProgress: `${progress.completed}/${progress.total}`,
        averageRating: trainer.rating || 0
      },

      pendingActions: pending.map(p => DashboardMapper.toTrainerPendingActionsResponse(p)),

      performanceData: performance.map(p => DashboardMapper.toTrainerPerformanceDTO(p)),

      recentChats: chatList.map(chat => ChatMapper.toTrainerChatListDTO(chat, trainerId))
    };
  }
}