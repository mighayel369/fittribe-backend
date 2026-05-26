import { FetchAllTrainersRequestDTO } from "application/dto/discovery/fetch-all-trainer.request.dto";


export const I_FETCH_ALL_TRAINERS_TOKEN = Symbol("I_FETCH_ALL_TRAINERS_TOKEN");
export const I_FETCH_ALL_CLIENT_TRAINERS_TOKEN = Symbol("I_FETCH_ALL_CLIENT_TRAINERS_TOKEN");
export const I_FETCH_ALL_PENDING_TRAINERS_TOKEN = Symbol("I_FETCH_ALL_PENDING_TRAINERS_TOKEN");

export interface IFetchAllTrainersUseCase<ResponseDTO> {
  execute(input: FetchAllTrainersRequestDTO): Promise<ResponseDTO>;
}