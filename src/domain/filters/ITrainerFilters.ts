import {  TrainerSortOptions } from "utils/Constants";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { GENDER } from "domain/constants/gender";
export interface ITrainerFilters {
    status?: TRAINER_STATUS
    search?: string;
    gender?: GENDER
    programId?: string;
    sort?: TrainerSortOptions;
}