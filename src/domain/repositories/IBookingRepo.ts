import { BookingEntity } from "domain/entities/BookingEntity";
import { BookingAggregate } from "./types/booking-aggregate.type";
import { AdminDashboardMetricsAggregate, AdminDashboardStats, TrainerPerformanceAnalytics } from "./types/admin-dashboard-aggregate";
import { IBookingFilters } from "domain/filters/IBookingFilters";
import { BOOKING_STATUS } from "domain/constants/booking-status";

export const I_BOOKING_REPO_TOKEN = Symbol("I_BOOKING_REPO_TOKEN");

export interface IBookingRepo {
  createBooking(payload: BookingEntity): Promise<void>;
  findBookingById(id: string): Promise<BookingEntity | null>;
  findBookingDetails(id: string): Promise<BookingAggregate | null>
  updateBooking(bookingId: string, data: BookingEntity): Promise<void>;
  findAllBookings(filter?: IBookingFilters, page?: number, limit?: number): Promise<{ data: BookingAggregate[]; totalCount: number }>;
  findBookedSlots(trainerId: string, date: string): Promise<number[]>;
  hasActiveBookingsForProgram(programId: string): Promise<boolean>;
  checkAvailability(trainerId: string, date: string, time: number): Promise<boolean>
  updateBookingStatus(bookingId: string, status: BOOKING_STATUS): Promise<void>;
  rescheduleBooking(bookingId: string, data: { newDate: Date, newTimeSlot: string }): Promise<void>
  getMonthlyEarnings(trainerId: string, month: number, year: number): Promise<number>;
  getPendingActions(trainerId: string): Promise<BookingAggregate[]>;
  getTodayProgress(trainerId: string): Promise<{ completed: number; total: number }>;
  getUpcomingAppointmentsByDate(trainerId: string, date: Date): Promise<BookingAggregate[]>;
  getPerformanceData(trainerId: string): Promise<{ month: string; sessionCount: number }[]>;
  findUpcomingBookingCount(trainerId: string): Promise<number>
  getAdminDashboardStats(): Promise<AdminDashboardStats>;
  getTrainerPerformanceAnalytics(): Promise<TrainerPerformanceAnalytics[]>;
  calculateUserRetention(): Promise<string>;
  getAdminDashboardMetrics(range?: '7days' | '6months'): Promise<AdminDashboardMetricsAggregate>;
}