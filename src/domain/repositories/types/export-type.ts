import { UserEntity } from "domain/entities/UserEntity";


export interface ChurnUsers extends Pick<UserEntity, "name" | "email" | "createdAt" | "phone"> {
    lastBookingDate: Date | null;
}