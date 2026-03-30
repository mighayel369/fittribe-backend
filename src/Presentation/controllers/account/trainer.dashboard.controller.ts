import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';

import { TrainerDashboardAppointmentResponseDTO, TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { ITrainerDashBoard } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { ITrainerDashBoardAppointments } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
@injectable()
export class TrainerDashboardController {
    constructor(
        @inject("ITrainerDashBoard") private _getMetrics: ITrainerDashBoard,
        @inject("ITrainerDashBoardAppointments") private _getAgenda: ITrainerDashBoardAppointments,
    ) { }

    getPerformanceMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as { id: string };
            const result: TrainerDashboardResponseDTO = await this._getMetrics.execute(trainerId);
            res.status(HttpStatus.OK).json({ success: true, message: SUCCESS_MESSAGES.DASHBOARD.DASHBOARD_DATA_FETCHED, dashboardData: result });
        } catch (err) { next(err); }
    };

    getDailyAgenda = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as { id: string };
            const { date } = req.query;
            const targetDate = date ? new Date(date as string) : new Date();
            const result: TrainerDashboardAppointmentResponseDTO = await this._getAgenda.execute(trainerId, targetDate);
            res.status(HttpStatus.OK).json({ success: true, message: SUCCESS_MESSAGES.DASHBOARD.TRAINER_APPOINTMENT_DATA, dashboardData: result });
        } catch (err) { next(err); }
    };
}