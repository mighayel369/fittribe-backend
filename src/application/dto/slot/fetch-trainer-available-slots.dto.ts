export interface FetchAvailableSlotsRequestDTO {
  trainerId: string;
  date: string;
}

export interface FetchAvailableSlotResponseDTO {
  status: string,
  slots: number[]
  message?: string
}
