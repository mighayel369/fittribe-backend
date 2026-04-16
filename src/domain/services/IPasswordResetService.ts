
export const I_PASSWORD_RESET_SERVICE_TOKEN = Symbol("I_PASSWORD_RESET_SERVICE_TOKEN");
export interface IPasswordResetService {
  generateResetToken(email: string): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean; role?: string }>;
}