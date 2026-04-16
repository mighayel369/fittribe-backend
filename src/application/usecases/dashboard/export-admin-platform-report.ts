import { inject, injectable } from "tsyringe";
import { IExportAdminPlatformReport } from "application/interfaces/dashboard/i-export-admin-platform-report";
import { ReportGeneratorService } from "infrastructure/services/report-generator.service";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";

@injectable()
export class ExportAdminDashboardReport implements IExportAdminPlatformReport {
    constructor(
        @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
        @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepo: ITrainerRepo
    ) {}

    async execute(): Promise<Buffer> {
        const [analytics, totalActiveTrainers, trainerPerformance, retentionRate] = await Promise.all([
            this._bookingRepo.getAdminDashboardStats(),
            this._trainerRepo.countActiveTrainers(),
            this._bookingRepo.getTrainerPerformanceAnalytics(),
            this._bookingRepo.calculateUserRetention()
        ]);

        const overviewRows = [
            ['OVERVIEW', 'Total Revenue', `$${analytics.metrics.totalRevenue.toLocaleString()}`],
            ['OVERVIEW', 'Total Bookings', analytics.metrics.totalBookings.toString()],
            ['OVERVIEW', 'Active Trainers', totalActiveTrainers.toString()],
            ['OVERVIEW', 'User Retention', `${retentionRate}%`],
            ['', '', ''] 
        ];

        const performanceRows = trainerPerformance.map((trainer: any) => [
            'TOP TRAINER',
            trainer.name,
            `Bks: ${trainer.bookings} | Rev: ${trainer.revenue} | Rate: ${trainer.rating}`
        ]);

        return await ReportGeneratorService.toPdf({
            title: 'FitTribe Admin Platform Report',
            subtitle: `Summary Analytics - Generated on: ${new Date().toLocaleDateString()}`,
            headers: ['Category', 'Metric', 'Details / Value'],
            columnWidths: [100, 150, 250],
            rows: [...overviewRows, ...performanceRows]
        });
    }
}