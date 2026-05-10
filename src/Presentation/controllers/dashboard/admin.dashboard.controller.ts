import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_ADMIN_DASHBOARD_TOKEN, IAdminDashboard } from 'application/interfaces/dashboard/i-admin-dashboard.usecase';
import { I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN, IExportAdminPlatformReport } from 'application/interfaces/dashboard/i-export-admin-platform-report';
import { FILE_CONSTANTS } from 'utils/Constants';
import { FileResponseHelper } from 'utils/file.constants';

@injectable()
export class AdminDashboardController {
    constructor(
        @inject(I_ADMIN_DASHBOARD_TOKEN)
        private readonly _getAdminDashboardUseCase: IAdminDashboard,

        @inject(I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN)
        private readonly _exportDashboardReportUseCase: IExportAdminPlatformReport,
    ) { }

    getPlatformInsights = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const dashboardData = await this._getAdminDashboardUseCase.execute();
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DASHBOARD.DASHBOARD_DATA_FETCHED,
                dashboardData
            });
        } catch (err) {

            next(err);
        }
    }

    exportDashboardReport = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const pdfBuffer = await this._exportDashboardReportUseCase.execute();
            FileResponseHelper.sendPdf(res, pdfBuffer, FILE_CONSTANTS.DASHBOARD_PREFIX);
        } catch (err) {
            next(err);
        }
    }
}