export interface TimeRange {
  start: number;
  end: number;
}

export interface DayAvailability {
  enabled: boolean;
  slots: TimeRange[];
}

export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}