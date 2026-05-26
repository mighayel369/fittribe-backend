import { ResetPasswordRequestDTO } from "application/dto/auth/shared/reset-password.dto";

export const I_RESET_PASSWORD_USECASE_TOKEN = Symbol("I_RESET_PASSWORD_USECASE_TOKEN");

export interface IResetPasswordUseCase {
  execute( input: ResetPasswordRequestDTO): Promise<void>;
}