import { inject, injectable } from "tsyringe";
import { IAdminDashboard } from "application/interfaces/dashboard/i-admin-dashboard.usecase";
import { AdminDashbardResponseDTO } from "application/dto/dashboard/admin/admin-dashboard.response.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { DashboardMapper } from "application/mappers/dashboard-mapper";


@injectable()
export class AdminDashboardUsecase implements IAdminDashboard {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository:
      IBookingRepo,

    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository:
      ITrainerRepo
  ) { }

  async execute():
    Promise<AdminDashbardResponseDTO> {

    const [
      stats,
      totalActiveTrainers,
      trainerPerformance,
      rententionRate
    ] = await Promise.all([
      this._bookingRepository
        .getAdminDashboardStats(),
      this._trainerRepository
        .countActiveTrainers(),
      this._bookingRepository
        .getTrainerPerformanceAnalytics(),
      this._bookingRepository
        .calculateUserRetention()
    ]);


    return DashboardMapper
      .toAdminDashboardResponse(
        stats,
        totalActiveTrainers,
        trainerPerformance,
        rententionRate
      );
  }
}
