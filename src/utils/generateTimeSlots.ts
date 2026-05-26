import { TimeRange } from "domain/entities/types/slot.types";

export const generateHourlySlots = (
    ranges: TimeRange[],
    duration = 60
) => {
    const slots: number[] = [];
    for (const range of ranges) {
        let startMin = range.start
        const endMin = range.end

        while (startMin + duration <= endMin) {
            slots.push(startMin);
            startMin += duration;
        }
    }
    return slots;
};


export const timeToMin = (time: string): number => {

    const [t, modifier] = time.split(" ")
    const [originalHours, minutes] = t.split(":").map(Number)
    let hours = originalHours
    if (modifier === "PM" && hours !== 12) hours += 12
    if (modifier === "AM" && hours === 12) hours = 0

    return hours * 60 + minutes
}

export const minutesToTime = (mins: number): string => {
    let hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    const modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${modifier}`;
};

