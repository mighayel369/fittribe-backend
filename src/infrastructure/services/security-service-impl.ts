import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { injectable } from 'tsyringe';
import { ISecurityService } from 'domain/services/i-security-service';
@injectable()
export class SecurityServiceImpl implements ISecurityService {
  private readonly _passwordSaltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this._passwordSaltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  hashToken(token: string): string {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }


  generateSecureToken(): { rawToken: string; hashedToken: string } {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = this.hashToken(rawToken);

    return { rawToken, hashedToken };
  }
}