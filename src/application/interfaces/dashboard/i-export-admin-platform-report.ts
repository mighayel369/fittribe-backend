export const I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN = Symbol("I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN");

export interface IExportAdminPlatformReport{
    execute():Promise<Buffer>
}