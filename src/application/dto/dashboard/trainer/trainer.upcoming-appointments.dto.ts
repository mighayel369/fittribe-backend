import z from 'zod'
import { BOOKING_STATUS } from 'domain/constants/booking-status';

export const UpcomingAppointmentsSchema = z.object({
    bookingId: z.string(),
    clientName: z.string(),
    timeSlot: z.string(),
    program: z.string(),
    status: z.enum(BOOKING_STATUS),
    profilePic: z.string(),
});

export type upcomingAppointmentsDTO =
    z.infer<typeof UpcomingAppointmentsSchema>;


export const TrainerDashboardAppointmentResponseSchema =
    z.object({
        upcomingAppointments: z.array(
            UpcomingAppointmentsSchema
        )
    });

export type TrainerDashboardAppointmentResponseDTO =
    z.infer<typeof TrainerDashboardAppointmentResponseSchema>;
