import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
import { TrainerDashboardAppointmentResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { DashboardMapper } from "application/mappers/dashboard-mapper";

@injectable()
export class TrainerDashboardAppointmentUsecase implements ITrainerDashBoardAppointments {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo
  ) {}

  async execute(trainerId: string, date: Date): Promise<TrainerDashboardAppointmentResponseDTO> {
    const appointments = await this._bookingRepo.getUpcomingAppointmentsByDate(trainerId, date);
console.log(appointments)
    return DashboardMapper.toTrainerAppointmentResponseDTO(appointments)
  }
}