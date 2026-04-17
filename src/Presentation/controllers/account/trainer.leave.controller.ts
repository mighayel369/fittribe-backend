import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';

import { IApplyLeaveRequest,I_APPLY_LEAVE_REQUEST_TOKEN } from 'application/interfaces/leave/i-apply-leave-requests.usecase';
import { RequestLeaveDTO } from 'application/dto/leave/request.leave.dto';
import { FetchLeaveRequestsInputDTO, FetchTrainerLeaveResponseDTO } from 'application/dto/leave/leave-requests.dto';
import { IFetchAllLeaveRequests,I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN } from 'application/interfaces/leave/i-fetch-all-leave-requests';
import { IWithdrawLeaveRequest,I_WITHDRAW_LEAVE_REQUEST_TOKEN} from 'application/interfaces/leave/i-withdraw-leave-request';
import { ITrainerLeaveMetrics,I_GET_TRAINER_LEAVE_METRICS_TOKEN } from 'application/interfaces/leave/i-trainer-leave-metrics';
import { PAGINATION } from 'utils/Constants';
import { LeaveParams } from 'Presentation/interfaces/request.params';
@injectable()
export class LeaveController {
constructor(
        @inject(I_APPLY_LEAVE_REQUEST_TOKEN) 
        private _applyLeave: IApplyLeaveRequest,
        
        @inject(I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN) 
        private _getleaveRequestHistory: IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO>,
        
        @inject(I_GET_TRAINER_LEAVE_METRICS_TOKEN) 
        private _getMetrics: ITrainerLeaveMetrics,
        
        @inject(I_WITHDRAW_LEAVE_REQUEST_TOKEN) 
        private _withdrawLeaveRequest: IWithdrawLeaveRequest
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

    withdrawLeaveRequest = async (req: Request<LeaveParams>, res: Response, next: NextFunction) => {
        try {
            let leaveId= req.params.leaveId
            if(!leaveId){
                throw new AppError("leave id missing",HttpStatus.BAD_REQUEST)
            }
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