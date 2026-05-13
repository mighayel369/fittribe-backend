import { inject, injectable } from "tsyringe";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IFetchTrainerAvailableSlotsUseCase } from "application/interfaces/slot/i-fetch-trainer-available-slots.usecase";
import { generateHourlySlots } from "utils/generateTimeSlots";
import { FetchAvailableSlotResponseDTO, FetchAvailableSlotsRequestDTO } from "application/dto/slot/fetch-trainer-available-slots.dto";
import { I_LEAVE_REPO_TOKEN, ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { SCHEDULE_STATUS } from "utils/Constants";
@injectable()
export class FetchTrainerAvailableSlotsUseCase implements IFetchTrainerAvailableSlotsUseCase {
  constructor(
    @inject(I_SLOT_REPO_TOKEN) private readonly _slotRepository: ISlotRepo,
    @inject(I_BOOKING_REPO_TOKEN) private readonly _bookingRepository: IBookingRepo,
    @inject(I_LEAVE_REPO_TOKEN) private readonly _leaveRepository: ILeaveRepo,
  ) { }

  async execute(queryInput: FetchAvailableSlotsRequestDTO): Promise<FetchAvailableSlotResponseDTO> {
    const { trainerId, date: dateStr } = queryInput;
    const date = new Date(dateStr);

    const isOnLeave = await this._leaveRepository.isTrainerOnLeave(trainerId, date);
    if (isOnLeave) {
      return {
        status: SCHEDULE_STATUS.ON_LEAVE,
        message: SUCCESS_MESSAGES.SLOT.TRAINER_ON_LEAVE,
        slots: []
      };
    }

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const slotDoc = await this._slotRepository.getTrainerSlot(trainerId);

    if (!slotDoc) return { status: SCHEDULE_STATUS.NO_SCHEDULE, slots: [], message: SUCCESS_MESSAGES.SLOT.NO_AVAILABILITY_SET };

    const dayAvailability = slotDoc.weeklyAvailability[dayName as keyof typeof slotDoc.weeklyAvailability];
    if (!dayAvailability || dayAvailability.length === 0) {
      return { status: SCHEDULE_STATUS.UNAVAILABLE, slots: [], message: ERROR_MESSAGES.TRAINER_ON_LEAVE };
    }

    const allPossibleSlots = generateHourlySlots(dayAvailability, date);

    const bookedSlots = await this._bookingRepository.findBookedSlots(trainerId, date);

    const bookedSet = new Set(bookedSlots);

    const availableSlots = allPossibleSlots.filter(slot => !bookedSet.has(slot));
    console.log(availableSlots)
    return {
      status: SCHEDULE_STATUS.AVAILABLE,
      slots: availableSlots,
      message: availableSlots.length > 0
        ? SUCCESS_MESSAGES.SLOT.SLOT_FETCHED_SUCCESSFULLY
        : SUCCESS_MESSAGES.SLOT.SLOT_FULLY_BOOKED
    };
  }
}