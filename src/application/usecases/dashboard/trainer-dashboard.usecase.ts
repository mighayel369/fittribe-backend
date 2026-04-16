import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { AppError } from "domain/errors/AppError";
import { DashboardMapper } from "application/mappers/dashboard-mapper";
import { IChatRepo,I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
@injectable()
export class TrainerDashboardUsecase implements ITrainerDashBoard {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
    @inject(I_TRAINER_REPO_TOKEN) private _trainerRepo: ITrainerRepo,
     @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo
  ) {}

  async execute(trainerId: string): Promise<TrainerDashboardResponseDTO> {
    const trainer = await this._trainerRepo.findTrainerById(trainerId);
    if (!trainer) throw new AppError("Trainer not found", 404);

    const now = new Date();
    
    const [earnings, pending, progress, performance, upcomingTotal,chatList] = await Promise.all([
      this._bookingRepo.getMonthlyEarnings(trainerId, now.getMonth(), now.getFullYear()),
      this._bookingRepo.getPendingActions(trainerId),
      this._bookingRepo.getTodayProgress(trainerId),
      this._bookingRepo.getPerformanceData(trainerId),
      this._bookingRepo.findUpcomingBookingCount(trainerId),
      this._chatRepo.getChatListForTrainer(trainer.trainerId)
    ]);

    return DashboardMapper.toTrainerDashboardResponseDTO(
      earnings,
      pending,
      progress,
      performance,
      upcomingTotal,
      trainer.rating || 0,
      chatList,
      trainerId
    );
  }
}