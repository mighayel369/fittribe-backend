import { FetchAllTrainersRequestDTO } from "application/dto/trainer/fetch-all-trainers.dto";


export const I_FETCH_ALL_TRAINERS_TOKEN = Symbol("I_FETCH_ALL_TRAINERS_TOKEN");
export const I_FETCH_ALL_CLIENT_TRAINERS_TOKEN = Symbol("I_FETCH_ALL_CLIENT_TRAINERS_TOKEN");
export const I_FETCH_ALL_PENDING_TRAINERS_TOKEN = Symbol("I_FETCH_ALL_PENDING_TRAINERS_TOKEN");

export interface IFetchAllTrainersUseCase<responseDTO>{
    execute(input:FetchAllTrainersRequestDTO):Promise<responseDTO>
}