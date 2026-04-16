import { IExportLeaveReport } from "application/interfaces/leave/i-export-leave-resport";
import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { ReportGeneratorService } from "infrastructure/services/report-generator.service";

@injectable()
export class ExportLeaveReport implements IExportLeaveReport {
    constructor(@inject(I_LEAVE_REPO_TOKEN) private _leaveRepo: ILeaveRepo) { }

    async execute(): Promise<Buffer> {
        const leaves = await this._leaveRepo.findLeaveReport();

        const rows = leaves.map(leave=>LeaveMapper.toPdfRow(leave))

        return await ReportGeneratorService.toPdf({
            title: 'FitTribe Leave Report',
            subtitle: `Generated on: ${new Date().toLocaleDateString()}`,
            headers: ['Trainer', 'Type', 'Start Date', 'Days', 'Status'],
            columnWidths: [150, 100, 100, 50, 100],
            rows: rows
        });
    }
}