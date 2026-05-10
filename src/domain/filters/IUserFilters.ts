import { USER_STATUS_FILTERS } from "utils/Constants"

export interface IUserFilters {
    search?: string
    status?: USER_STATUS_FILTERS
}