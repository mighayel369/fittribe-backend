import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_ADMIN_DASHBOARD_TOKEN, IAdminDashboard } from 'application/interfaces/dashboard/i-admin-dashboard.usecase';

@injectable()
export class AdminDashboardController {
    constructor(
        @inject(I_ADMIN_DASHBOARD_TOKEN)
        private readonly _getAdminDashboardUseCase: IAdminDashboard,
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
}