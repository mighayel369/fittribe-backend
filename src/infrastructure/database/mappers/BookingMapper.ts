import { BookingEntity } from "domain/entities/BookingEntity";
import { TrainerMapper } from "./TrainerMapper";
import { UserMapper } from "./UserMapper";
import { IBooking } from "../models/BookingModel";


export const BookingMapper = {
  toEntity(doc: IBooking): BookingEntity {
    return new BookingEntity(
      doc.bookingId,
      typeof doc.user === 'object' ? UserMapper.toEntity(doc.user as any) : doc.user,
      typeof doc.trainer === 'object' ? TrainerMapper.toEntity(doc.trainer as any) : doc.trainer,
      doc.program,
      doc.date,
      doc.timeSlot,
      doc.duration,
      doc.totalAmount,
      doc.adminCommission,
      doc.trainerEarning,
      doc.status,
      {
        method: doc.payment.method,
        status: doc.payment.status,
      },
      doc.rescheduleRequest ? {
        newDate: doc.rescheduleRequest.newDate,
        newTimeSlot: doc.rescheduleRequest.newTimeSlot,
        requestedBy: doc.rescheduleRequest.requestedBy,
        createdAt: (doc as any).updatedAt || new Date(),
      } : undefined,
      doc.rescheduleCount,
      doc.rejectReason,
      doc.meetLink,
      doc.isReviewed
    );
  },

  toPersistence(entity: BookingEntity): Partial<IBooking> {
    return {
      bookingId: entity.bookingId,
      user: typeof entity.userId === 'object' ? (entity.userId as any).userId : entity.userId,       
      trainer: typeof entity.trainerId === 'object' ? (entity.trainerId as any).trainerId : entity.trainerId,
      program: entity.program,
      date: entity.date,
      timeSlot: entity.timeSlot,
      duration: entity.duration,
      totalAmount: entity.totalAmount,
      adminCommission: entity.adminCommission,
      trainerEarning: entity.trainerEarning,
      status: entity.status,
      payment: {
        method: entity.payment.method,
        status: entity.payment.status
      },
      rescheduleRequest: entity.rescheduleRequest ? {
        newDate: entity.rescheduleRequest.newDate,
        newTimeSlot: entity.rescheduleRequest.newTimeSlot,
        requestedBy: (entity.rescheduleRequest as any).requestedBy || "user"
      } : undefined,
      rescheduleCount: entity.rescheduleCount || 0,
      rejectReason: entity.rejectReason,
      meetLink: entity.meetLink,
      isReviewed: entity.isReviewed
    };
  }
};