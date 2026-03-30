import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IAdminDashboard } from 'application/interfaces/dashboard/i-admin-dashboard.usecase';
import { IGetAdminLeaveMetrics } from 'application/interfaces/leave/i-admin-leave-metrics';
import { FetchAdminLeaveResponseDTO, FetchLeaveRequestsInputDTO } from 'application/dto/leave/leave-requests.dto';
import { IFetchAllLeaveRequests } from 'application/interfaces/leave/i-fetch-all-leave-requests';
import { IUpdateLeaveStatus } from 'application/interfaces/leave/i-update-leave-status';
import { UpdateLeaveStatusRequestDTO } from 'application/dto/leave/update-status.dto';
@injectable()
export class AdminManagementController {
    constructor(
        @inject("IAdminDashboard") private _getAdmindashboard: IAdminDashboard,
        @inject("GetAdminLeaveMetrics") private _getMetrics: IGetAdminLeaveMetrics,
        @inject("FetchAllAdminLeaveRequests") private _getleaveRequestHistory: IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO>,
        @inject("UpdateLeaveStatus") private _updateStatus: IUpdateLeaveStatus
    ) { }
    getPlatformInsights = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let data = await this._getAdmindashboard.execute()
            console.log(data)
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DASHBOARD.DASHBOARD_DATA_FETCHED,
                dashboardData: data
            })
        } catch (err) {
            next(err)
        }
    }

    getLeaveMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const metrics = await this._getMetrics.execute();
            console.log(metrics)
            res.status(HttpStatus.OK).json({
                success: true,
                data: metrics
            });
        } catch (err) {
            next(err);
        }
    }
    getLeaveRequestsHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const input: FetchLeaveRequestsInputDTO = {
                currentPage: Number(req.query.pageNo) || 1,
                limit: Number(req.query.limit) || 5,
                searchQuery: (req.query.search as string) || "",
                filter: {},
            };

            const result: FetchAdminLeaveResponseDTO = await this._getleaveRequestHistory.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (err) {
            next(err);
        }
    }

    updateLeaveStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: leaveId } = req.params;

            const input: UpdateLeaveStatusRequestDTO = {
                leaveId,
                status: req.body.status,
                adminComment: req.body.adminComment
            };

            await this._updateStatus.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: `Leave request has been ${input.status} successfully.`
            });
        } catch (err) {
            next(err);
        }
    }
}