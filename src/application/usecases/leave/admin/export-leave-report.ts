import { inject, injectable } from "tsyringe";
import { IExportLeaveReport } from "application/interfaces/leave/i-export-leave-resport";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { ReportGeneratorService } from "infrastructure/services/report-generator.service";
import { LeaveExportDataResponseDTO } from "application/dto/leave/leave-export-data.dto";
import { LeaveMapper } from "application/mappers/leave-mapper"

@injectable()
export class ExportLeaveReport implements IExportLeaveReport {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo
  ) { }

  async execute(): Promise<Buffer> {
    const rawRecords = await this._leaveRepository.findLeaveReport();


    const leaveRecords = LeaveMapper.toExportDTOList(rawRecords);

    return await ReportGeneratorService.toPdf({
      title: "FitTribe Leave Management Report",
      subtitle: `Generated on ${new Date().toLocaleDateString()}`,
      headers: ["Trainer Name", "Leave Type", "Start Date", "Duration (Days)", "Status"],
      columnWidths: [150, 100, 100, 80, 70],
      rows: leaveRecords,
      rowMapper: (row: LeaveExportDataResponseDTO) => [
        row.trainerName,
        row.type,
        row.startDate,
        String(row.days),
        row.status
      ]
    });
  }
}