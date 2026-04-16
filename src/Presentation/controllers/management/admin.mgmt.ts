import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_ADMIN_DASHBOARD_TOKEN, IAdminDashboard } from 'application/interfaces/dashboard/i-admin-dashboard.usecase';
import { I_GET_ADMIN_LEAVE_METRICS_TOKEN, IGetAdminLeaveMetrics } from 'application/interfaces/leave/i-admin-leave-metrics';
import { FetchAdminLeaveResponseDTO, FetchLeaveRequestsInputDTO } from 'application/dto/leave/leave-requests.dto';
import { I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN, IFetchAllLeaveRequests } from 'application/interfaces/leave/i-fetch-all-leave-requests';
import { I_UPDATE_LEAVE_STATUS_TOKEN, IUpdateLeaveStatus } from 'application/interfaces/leave/i-update-leave-status';
import { UpdateLeaveStatusRequestDTO } from 'application/dto/leave/update-status.dto';
import { I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN, IExportAdminPlatformReport } from 'application/interfaces/dashboard/i-export-admin-platform-report';
import { IExportLeaveReport, I_EXPORT_LEAVE_REPORT_TOKEN } from 'application/interfaces/leave/i-export-leave-resport';
import { ExportLeaveReport } from 'application/usecases/leave/export-leave-report';
@injectable()
export class AdminManagementController {
    constructor(
        @inject(I_ADMIN_DASHBOARD_TOKEN) private _getAdmindashboard: IAdminDashboard,
        @inject(I_GET_ADMIN_LEAVE_METRICS_TOKEN) private _getMetrics: IGetAdminLeaveMetrics,
        @inject(I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN) private _getleaveRequestHistory: IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO>,
        @inject(I_UPDATE_LEAVE_STATUS_TOKEN) private _updateStatus: IUpdateLeaveStatus,
        @inject(I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN) private _exportAdminDashboardData: IExportAdminPlatformReport,
        @inject(I_EXPORT_LEAVE_REPORT_TOKEN) private _exportLeaveReport: IExportLeaveReport,

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

    exportDashboardReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pdfBuffer = await this._exportAdminDashboardData.execute();

            const dateString = new Date().toISOString().split('T')[0];
            const fileName = `FitTribe-Dashboard-Report-${dateString}.pdf`;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

            res.status(HttpStatus.OK).send(pdfBuffer);
        } catch (err) {
            next(err);
        }
    }

    exportLeaveReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pdfBuffer = await this._exportLeaveReport.execute();

            const dateString = new Date().toISOString().split('T')[0];
            const fileName = `FitTribe-Leave-Report-${dateString}.pdf`;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

            res.status(HttpStatus.OK).send(pdfBuffer);
        } catch (err) {
            next(err);
        }
    }
}