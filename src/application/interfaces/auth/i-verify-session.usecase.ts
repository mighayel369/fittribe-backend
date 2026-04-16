
export const I_VERIFY_CLIENT_SESSION_TOKEN = Symbol("I_VERIFY_CLIENT_SESSION_TOKEN");
export const I_VERIFY_TRAINER_SESSION_TOKEN = Symbol("I_VERIFY_TRAINER_SESSION_TOKEN");
export interface IVerifySession<T> {
    execute(id: string): Promise<T>;
}