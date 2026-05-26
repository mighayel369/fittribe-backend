import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';

import { IApplyLeaveRequest, I_APPLY_LEAVE_REQUEST_TOKEN } from 'application/interfaces/leave/i-apply-leave-requests.usecase';
import { RequestLeaveDTO } from 'application/dto/leave/trainer/request.leave.dto';
import { IFetchAllLeaveRequests, I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN } from 'application/interfaces/leave/i-fetch-all-leave-requests';
import { IWithdrawLeaveRequest, I_WITHDRAW_LEAVE_REQUEST_TOKEN } from 'application/interfaces/leave/i-withdraw-leave-request';
import { ITrainerLeaveMetrics, I_GET_TRAINER_LEAVE_METRICS_TOKEN } from 'application/interfaces/leave/i-trainer-leave-metrics';
import { FetchTrainerLeaveResponseDTO } from 'application/dto/leave/trainer/leave-lists.dto';
import { fetchAllLeaveQueryDTO } from 'application/dto/leave/shared/leave-requests.dto';
@injectable()
export class LeaveController {
    constructor(
        @inject(I_APPLY_LEAVE_REQUEST_TOKEN)
        private readonly _applyLeaveUseCase: IApplyLeaveRequest,

        @inject(I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN)
        private readonly _getLeaveHistoryUseCase: IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO>,

        @inject(I_GET_TRAINER_LEAVE_METRICS_TOKEN)
        private readonly _getLeaveMetricsUseCase: ITrainerLeaveMetrics,

        @inject(I_WITHDRAW_LEAVE_REQUEST_TOKEN)
        private readonly _withdrawLeaveUseCase: IWithdrawLeaveRequest
    ) { }

    applyForLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const { type, startDate, endDate, reason } = req.body;

            const leaveRequestPayload: RequestLeaveDTO = {
                type,
                startDate,
                endDate,
                reason,
                documents: req.file
            };

            await this._applyLeaveUseCase.execute(leaveRequestPayload, trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LEAVE.LEAVE_APPLIED_SUCCESSFULLY
            });
        } catch (error) { next(error); }
    };

    getLeaveRequestsHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const query = req.query as unknown as fetchAllLeaveQueryDTO

            const historyResult: FetchTrainerLeaveResponseDTO = await this._getLeaveHistoryUseCase.execute(query);

            res.status(HttpStatus.OK).json({
                success: true,
                data: historyResult.data,
                total: historyResult.totalCount
            });

        } catch (err) {
            next(err);
        }
    };

    getLeaveMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const leaveMetrics = await this._getLeaveMetricsUseCase.execute(trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: leaveMetrics
            });
        } catch (err) { next(err); }
    };

    withdrawLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const  leaveId  = req.params.leaveid as string;

            if (!leaveId) {
                throw new AppError(ERROR_MESSAGES.LEAVEID_MISSING, HttpStatus.BAD_REQUEST);
            }

            await this._withdrawLeaveUseCase.execute(leaveId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LEAVE.LEAVE_WITHDRAWN
            });
        } catch (err) { next(err); }
    };
}