export const I_EXPORT_LEAVE_REPORT_TOKEN = Symbol("I_EXPORT_LEAVE_REPORT_TOKEN");

export interface IExportLeaveReport{
    execute():Promise<Buffer>
}