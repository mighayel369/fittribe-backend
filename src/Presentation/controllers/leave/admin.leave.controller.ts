import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_GET_ADMIN_LEAVE_METRICS_TOKEN, IGetAdminLeaveMetrics } from 'application/interfaces/leave/i-admin-leave-metrics';
import { I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN, IFetchAllLeaveRequests } from 'application/interfaces/leave/i-fetch-all-leave-requests';
import { I_UPDATE_LEAVE_STATUS_TOKEN, IUpdateLeaveStatus } from 'application/interfaces/leave/i-update-leave-status';
import { IExportLeaveReport, I_EXPORT_LEAVE_REPORT_TOKEN } from 'application/interfaces/leave/i-export-leave-resport';
import { FILE_CONSTANTS } from 'utils/Constants';
import { FileResponseHelper } from 'utils/file.constants';
import { FetchAdminLeaveResponseDTO } from 'application/dto/leave/admin/leave-list.dto';
import { fetchAllLeaveQueryDTO } from 'application/dto/leave/shared/leave-requests.dto';

@injectable()
export class AdminLeaveManagementController {
    constructor(
        @inject(I_GET_ADMIN_LEAVE_METRICS_TOKEN)
        private readonly _getLeaveMetricsUseCase: IGetAdminLeaveMetrics,

        @inject(I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN)
        private readonly _getLeaveHistoryUseCase: IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO>,

        @inject(I_UPDATE_LEAVE_STATUS_TOKEN)
        private readonly _updateLeaveStatusUseCase: IUpdateLeaveStatus,

        @inject(I_EXPORT_LEAVE_REPORT_TOKEN)
        private readonly _exportLeaveReportUseCase: IExportLeaveReport,
    ) { }

    getLeaveMetrics = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveMetrics = await this._getLeaveMetricsUseCase.execute();
            res.status(HttpStatus.OK).json({
                success: true,
                data: leaveMetrics
            });
        } catch (err) {
            next(err);
        }
    }

    getLeaveRequestsHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const query = req.query as unknown as fetchAllLeaveQueryDTO

            const historyResult = await this._getLeaveHistoryUseCase.execute(query);

            res.status(HttpStatus.OK).json({
                success: true,
                data: historyResult.data,
                total: historyResult.totalCount
            });

        } catch (err) {
            next(err);
        }
    };

    updateLeaveStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const statusPayload = req.body

            await this._updateLeaveStatusUseCase.execute(statusPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LEAVE.UPDATE_LEAVE_STATUS(statusPayload.status)
            });
        } catch (err) {
            next(err);
        }
    }

    exportLeaveReport = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const pdfBuffer = await this._exportLeaveReportUseCase.execute();
            FileResponseHelper.sendPdf(res, pdfBuffer, FILE_CONSTANTS.LEAVE_REPORT_PREFIX);
        } catch (err) {
            next(err);
        }
    }
}