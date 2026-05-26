import { VerifyAccountRequestDTO } from "application/dto/auth/shared/verify-account.dto";

export const I_VERIFY_USER_ACCOUNT_TOKEN = Symbol("I_VERIFY_USER_ACCOUNT_TOKEN");
export const I_VERIFY_TRAINER_ACCOUNT_TOKEN = Symbol("I_VERIFY_TRAINER_ACCOUNT_TOKEN");

export interface IVerifyAccountUseCase {
  execute(input: VerifyAccountRequestDTO): Promise<void>;
}