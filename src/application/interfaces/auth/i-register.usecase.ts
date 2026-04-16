import { RegisterResponseDTO } from "application/dto/auth/register.dto";


export const I_CLIENT_REGISTER_USECASE_TOKEN = Symbol("I_CLIENT_REGISTER_USECASE_TOKEN");
export const I_TRAINER_REGISTER_USECASE_TOKEN = Symbol("I_TRAINER_REGISTER_USECASE_TOKEN");

export interface IRegisterUseCase<T> {
  execute(payload: T, file?: Express.Multer.File): Promise<RegisterResponseDTO>;
}