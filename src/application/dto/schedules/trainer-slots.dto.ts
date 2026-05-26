export interface BookingSlotsRequestDTO {
  trainerId: string;
  date: string;
}

export interface BookingSlotsResponseDTO {
  status: string,
  slots: number[]
  message?: string
}
