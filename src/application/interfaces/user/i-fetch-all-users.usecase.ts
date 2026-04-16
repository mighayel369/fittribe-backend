import { FetchAllUsersRequestDTO,FetchAllUsersResponseDTO } from "application/dto/user/fetch-all-users.dto";

export const I_FETCH_ALL_USERS_TOKEN = Symbol("I_FETCH_ALL_USERS_TOKEN");

export interface IFetchAllUsersUseCase{
    execute(input:FetchAllUsersRequestDTO):Promise<FetchAllUsersResponseDTO>
}