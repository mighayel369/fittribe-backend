import { DATE_RANGES } from "utils/Constants";

export const I_EXPORT_CHURN_USERS = Symbol("I_EXPORT_CHURN_USERS");


export interface IExportChurnUsers {
    execute(range: DATE_RANGES): Promise<Buffer>
}