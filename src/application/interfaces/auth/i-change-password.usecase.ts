import { ChangePasswordRequestDTO } from "application/dto/account/shared/update-password.dto";

export const I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN = Symbol("I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN");
export const I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN = Symbol("I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN");

export interface IChangePasswordUseCase {
  execute(ownerId: string,data: ChangePasswordRequestDTO): Promise<void>;
}