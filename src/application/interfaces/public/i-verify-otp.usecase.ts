import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";

export const I_VERIFY_USER_ACCOUNT_TOKEN = Symbol("I_VERIFY_USER_ACCOUNT_TOKEN");
export const I_VERIFY_TRAINER_ACCOUNT_TOKEN = Symbol("I_VERIFY_TRAINER_ACCOUNT_TOKEN");

export interface IVerifyAccountUseCase {
  execute(data: VerifyAccountRequestDTO): Promise<boolean>;
}