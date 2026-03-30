import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';

import { IApplyLeaveRequest } from 'application/interfaces/leave/i-apply-leave-requests.usecase';
import { RequestLeaveDTO } from 'application/dto/leave/request.leave.dto';
import { FetchLeaveRequestsInputDTO, FetchTrainerLeaveResponseDTO } from 'application/dto/leave/leave-requests.dto';
import { IFetchAllLeaveRequests } from 'application/interfaces/leave/i-fetch-all-leave-requests';
import { IWithdrawLeaveRequest } from 'application/interfaces/leave/i-withdraw-leave-request';
import { ITrainerLeaveMetrics } from 'application/interfaces/leave/i-trainer-leave-metrics';
import { PAGINATION } from 'utils/Constants';
@injectable()
export class LeaveController {
    constructor(
        @inject("ApplyLeaveRequests") private _applyLeave: IApplyLeaveRequest,
        @inject("FetchAllTrainerLeaveRequests") private _getleaveRequestHistory: IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO>,
        @inject("GetTrainerLeaveMetrics") private _getMetrics: ITrainerLeaveMetrics,
        @inject("IWithdrawLeaveRequest") private _withdrawLeaveRequest: IWithdrawLeaveRequest
    ) { }

    applyForLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            const body = req.body;

            const input: RequestLeaveDTO = {
                trainerId: id,
                type: body.type,
                startDate: body.startDate,
                endDate: body.endDate,
                reason: body.reason,
                documents: req.file
            };

            await this._applyLeave.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LEAVE.LEAVE_APPLIED_SUCCESSFULLY
            });
        } catch (error) { next(error); }
    };
    getLeaveRequestsHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };


            const pageNo = Number(req.query.pageNo) || 1;
            const limit = Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
            const search = (req.query.search as string) || "";

            const input: FetchLeaveRequestsInputDTO = {
                currentPage: pageNo,
                limit: limit,
                searchQuery: search,
                filter: {},
                trainerId: id
            };

            const result = await this._getleaveRequestHistory.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (err) { next(err); }
    };
    getLeaveMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('hello')
            const { id } = req.user as { id: string };
            const metrics = await this._getMetrics.execute(id);

            res.status(HttpStatus.OK).json({
                success: true,
                data: metrics
            });
        } catch (err) {
            next(err);
        }
    }

    withdrawLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            if (!id) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            let leaveId = req.params.id
            await this._withdrawLeaveRequest.execute(leaveId)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Leave request withdrawn successfully"
            })
        } catch (err) {
            next(err)
        }
    }
}