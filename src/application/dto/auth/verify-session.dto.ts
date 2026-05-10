import { TRAINER_STATUS } from "domain/constants/trainer-status";

interface BaseSessionDTO {
    name: string;
    role: string;
    profilePic: string;
    status: boolean;
}

export type ClientSessionDTO = BaseSessionDTO

export interface TrainerSessionDTO extends BaseSessionDTO {
    verified: TRAINER_STATUS
}