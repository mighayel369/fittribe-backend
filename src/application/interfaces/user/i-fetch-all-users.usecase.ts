import { FetchAllUsersQueryInput, FetchAllUsersResponseDTO } from "application/dto/management/user-management/all-users.dto";

export const I_FETCH_ALL_USERS_TOKEN = Symbol("I_FETCH_ALL_USERS_TOKEN");

export interface IFetchAllUsersUseCase {
    execute(input: FetchAllUsersQueryInput): Promise<FetchAllUsersResponseDTO>
}