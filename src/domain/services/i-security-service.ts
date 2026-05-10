export interface ISecurityService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;

  hashToken(token: string): string;
  generateSecureToken(): { rawToken: string; hashedToken: string };
}

export const I_SECURITY_SERVICE_TOKEN = Symbol("I_SECURITY_SERVICE_TOKEN");