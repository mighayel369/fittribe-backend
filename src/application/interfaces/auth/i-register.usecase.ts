import { RegisterResponseDTO } from "application/dto/auth/shared/register.response.dto";


export const I_CLIENT_REGISTER_USECASE_TOKEN = Symbol("I_CLIENT_REGISTER_USECASE_TOKEN");
export const I_TRAINER_REGISTER_USECASE_TOKEN = Symbol("I_TRAINER_REGISTER_USECASE_TOKEN");

export interface IRegisterUseCase<TRequest, TFile = Express.Multer.File> {
  execute( payload: TRequest, file?: TFile ): Promise<RegisterResponseDTO>;
}