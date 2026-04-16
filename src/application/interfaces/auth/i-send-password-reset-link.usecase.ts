export const I_CLIENT_PASSWORD_RESET_USECASE_TOKEN = Symbol("I_CLIENT_PASSWORD_RESET_USECASE_TOKEN");

export interface ISendPasswordResetLinkUseCase {
  execute(email: string): Promise<void>;
}