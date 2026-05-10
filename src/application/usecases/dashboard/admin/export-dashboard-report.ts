import { inject, injectable } from "tsyringe";
import { IExportAdminPlatformReport } from "application/interfaces/dashboard/i-export-admin-platform-report";
import { ReportGeneratorService } from "infrastructure/services/report-generator.service";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AdminPlatformReportRowDTO } from "application/dto/dashboard/admin-dashboard-export.dto";

@injectable()
export class ExportAdminDashboardReport implements IExportAdminPlatformReport {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(): Promise<Buffer> {
    const [dashboard, totalActiveTrainers, trainerPerformance, retentionRate] = await Promise.all([
      this._bookingRepository.getAdminDashboardStats(),
      this._trainerRepository.countActiveTrainers(),
      this._bookingRepository.getTrainerPerformanceAnalytics(),
      this._bookingRepository.calculateUserRetention()
    ]);

    const overviewRows: AdminPlatformReportRowDTO[] = [
      {
        category: 'OVERVIEW',
        metric: 'Total Revenue',
        details: `$${dashboard.metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      },
      {
        category: 'OVERVIEW',
        metric: 'Total Bookings',
        details: `${dashboard.metrics.totalBookings}`
      },
      {
        category: 'OVERVIEW',
        metric: 'Active Trainers',
        details: `${totalActiveTrainers}`
      },
      {
        category: 'OVERVIEW',
        metric: 'Retention',
        details: `${retentionRate || '0'}%`
      }
    ];

    const performanceRows: AdminPlatformReportRowDTO[] = trainerPerformance.map(t => ({
      category: 'TRAINER PERFORMANCE',
      metric: t.name,
      details: `Bookings: ${t.bookings} | Revenue: $${t.revenue.toLocaleString()} | Rating: ${t.rating} | Usage: ${t.usage}`
    }));

    return ReportGeneratorService.toPdf({
      title: 'FitTribe Admin Platform Report',
      subtitle: `Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`,
      headers: ['Category', 'Metric', 'Details'],
      columnWidths: [100, 150, 280],
      rows: [...overviewRows, ...performanceRows],
      rowMapper: (row) => [row.category, row.metric, row.details]
    });
  }
}