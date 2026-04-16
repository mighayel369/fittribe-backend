import { inject, injectable } from "tsyringe";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { IFetchTrainerAvailableSlotsUseCase } from "application/interfaces/slot/i-fetch-trainer-available-slots.usecase";
import { generateHourlySlots } from "utils/generateTimeSlots";
import { FetchAvailableSlotResponseDTO, FetchAvailableSlotsRequestDTO } from "application/dto/slot/fetch-trainer-available-slots.dto";
import { I_LEAVE_REPO_TOKEN, ILeaveRepo } from "domain/repositories/ILeaveRepo";
@injectable()
export class FetchTrainerAvailableSlotsUseCase implements IFetchTrainerAvailableSlotsUseCase {
  constructor(
    @inject(I_SLOT_REPO_TOKEN) private _slotRepo: ISlotRepo,
    @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
    @inject(I_LEAVE_REPO_TOKEN) private _leaveRepo: ILeaveRepo,
  ) {}

  async execute(input: FetchAvailableSlotsRequestDTO): Promise<FetchAvailableSlotResponseDTO> {
    const { trainerId, date:dateStr } = input;
    const date = new Date(dateStr);
    const isOnLeave = await this._leaveRepo.isTrainerOnLeave(trainerId, date);
    console.log(isOnLeave)
    if (isOnLeave) {
        return {
            status: "ON_LEAVE",
            message: "Trainer is currently on leave for the selected date.",
            slots: []
        };
    }

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const slotDoc = await this._slotRepo.getTrainerSlot(trainerId);
    
    if (!slotDoc) return { status: "NO_SCHEDULE", slots: [], message: "No schedule set." };

    const dayAvailability = slotDoc.weeklyAvailability[dayName as keyof typeof slotDoc.weeklyAvailability];
    if (!dayAvailability || dayAvailability.length === 0) {
        return { status: "UNAVAILABLE", slots: [], message: "Trainer does not work on this day." };
    }

    const allSlots = generateHourlySlots(dayAvailability, date);

    const bookedSlots = await this._bookingRepo.findBookedSlots(trainerId, date);

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return {
        status: "AVAILABLE",
        slots: availableSlots,
        message: availableSlots.length > 0 ? "Slots fetched successfully" : "All slots are fully booked."
    };
  }
}