export const I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN=Symbol("I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN")
export const I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN=Symbol("I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN")
export const I_RESET_PASSWORD_TOKEN = Symbol("I_RESET_PASSWORD_TOKEN");
export interface IChangePasswordUseCase<requestDTO>{
    execute(input:requestDTO):Promise<void>
}

