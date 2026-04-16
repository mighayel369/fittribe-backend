import { LoginResponseDTO,LoginRequestDTO } from "application/dto/auth/login.dto";

export const I_ADMIN_LOGIN_USECASE_TOKEN = Symbol("I_ADMIN_LOGIN_USECASE_TOKEN");
export const I_CLIENT_LOGIN_USECASE_TOKEN = Symbol("I_CLIENT_LOGIN_USECASE_TOKEN");
export const I_TRAINER_LOGIN_USECASE_TOKEN = Symbol("I_TRAINER_LOGIN_USECASE_TOKEN");

export interface ILoginUseCase {
  execute(input:LoginRequestDTO): Promise<LoginResponseDTO>;
}