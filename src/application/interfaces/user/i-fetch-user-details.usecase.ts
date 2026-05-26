
export const I_FETCH_USER_PROFILE_TOKEN = Symbol("I_FETCH_USER_PROFILE_TOKEN");
export const I_FETCH_USER_DETAILS_ADMIN_TOKEN = Symbol("I_FETCH_USER_DETAILS_ADMIN_TOKEN");

export interface IFetchUserProfileUseCase<TResponse> {
    execute(userId: string): Promise<TResponse>;
}