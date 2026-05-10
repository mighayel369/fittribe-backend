import { inject, injectable } from "tsyringe";
import { I_TRAINER_DASHBOARD_TOKEN, ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from "utils/HttpStatus";
import { ITrainerDashBoardAppointments, I_TRAINER_DASHBOARD_APPOINTMENTS_TOKEN } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
import { TrainerDashboardAppointmentResponseDTO, TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class TrainerDashboardController {
    constructor(
        @inject(I_TRAINER_DASHBOARD_TOKEN)
        private readonly _getPerformanceMetricsUseCase: ITrainerDashBoard,

        @inject(I_TRAINER_DASHBOARD_APPOINTMENTS_TOKEN)
        private readonly _getDailyAgendaUseCase: ITrainerDashBoardAppointments,
    ) { }

    getPerformanceMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const performanceMetrics: TrainerDashboardResponseDTO =
                await this._getPerformanceMetricsUseCase.execute(trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DASHBOARD.DASHBOARD_DATA_FETCHED,
                dashboardData: performanceMetrics
            });
        } catch (err) {
            next(err);
        }
    };

    getDailyAgenda = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { date } = req.query;
            if (typeof date !== "string") {
                throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST)
            }
            const targetDate: Date = date ? new Date(date) : new Date();

            const dailyAgenda: TrainerDashboardAppointmentResponseDTO =
                await this._getDailyAgendaUseCase.execute(trainerId, targetDate);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DASHBOARD.TRAINER_APPOINTMENT_DATA,
                dashboardData: dailyAgenda
            });
        } catch (err) {
            next(err);
        }
    };
}