import { inject, injectable } from "tsyringe";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
import { TrainerDashboardAppointmentResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { DashboardMapper } from "application/mappers/dashboard-mapper";

@injectable()
export class TrainerDashboardAppointmentUsecase implements ITrainerDashBoardAppointments {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingQueryRepo: IBookingRepo
  ) { }

  async execute(trainerId: string, selectedDate: Date): Promise<TrainerDashboardAppointmentResponseDTO> {

    const data = await this._bookingQueryRepo.getUpcomingAppointmentsByDate(
      trainerId,
      selectedDate
    );
    const mappedData = data.map(booking => DashboardMapper.toUpcomingAppointmentDTO(booking))
    return {
      upcomingAppointments: mappedData
    }
  }
}