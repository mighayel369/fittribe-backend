import { BOOKING_TYPES } from "utils/Constants";
import { BOOKING_STATUS } from "domain/constants/booking-status";
export interface IBookingFilters {
    date?:Date,
    status?: BOOKING_STATUS;
    trainerId?: string;
    clientId?: string;
    filterType?: BOOKING_TYPES;
    dateRange?:{start:Date,end:Date},
    minAmount?: number;
    search?: string;
}