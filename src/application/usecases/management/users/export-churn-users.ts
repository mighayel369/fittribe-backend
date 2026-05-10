
import { IExportChurnUsers } from "application/interfaces/user/i-export-churn-users";
import { inject, injectable } from "tsyringe";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { ReportGeneratorService } from "infrastructure/services/report-generator.service";
import { ChurnUserDto } from "application/dto/user/churn-users-export.dto";
import { DATE_RANGES } from "utils/Constants";

@injectable()
export class ExportChurnUsers implements IExportChurnUsers {
    constructor(
        @inject(I_USER_REPO_TOKEN)
        private readonly _userRepository: IUserRepo
    ) { }

    async execute(range: DATE_RANGES): Promise<Buffer> {

        const data = await this._userRepository.getChurnUsers(range);

        const churnUsersRows: ChurnUserDto[] = data.map((user) => ({
            name: user.name,
            email: user.email,
            joinedOn: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
            phone: user.phone || 'N/A',
            lastBookedDate: user.lastBookingDate
                ? new Date(user.lastBookingDate).toLocaleDateString()
                : "Never Booked"
        }));

        return ReportGeneratorService.toPdf({
            title: 'FitTribe Churn Users Report',
            subtitle: `Report Range: ${range} | Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`,
            headers: ["Name", "Email", "Phone", "Last Booked"],
            columnWidths: [120, 180, 100, 100],
            rows: churnUsersRows,
            rowMapper: (row) => [
                row.name,
                row.email,
                row.phone,
                row.lastBookedDate
            ]
        });
    }
}