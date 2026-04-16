import { inject,injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { AppError } from "domain/errors/AppError";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { UserRole } from "utils/Constants";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class VerifyUserAccountUseCase implements IVerifyAccountUseCase {
  constructor(
    @inject(I_OTP_SERVICE_TOKEN) private readonly _otpService: IOtpService,
    @inject(I_USER_REPO_TOKEN) private readonly _userRepo: IUserRepo,
    @inject(I_WALLET_REPO_TOKEN) private readonly _walletRepo: IWalletRepo,
  ) {}

  async execute(input: VerifyAccountRequestDTO): Promise<boolean> {
    const { email, otp } = input;

    const otpRecord = await this._otpService.verifyOtp(email, otp);
    if (!otpRecord || otpRecord.role !== UserRole.USER) {
      throw new AppError("Invalid OTP or unauthorized role", HttpStatus.BAD_REQUEST);
    }

    const user = await this._userRepo.findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    await this._userRepo.updateUserStatus(user.userId,true)

    await this._walletRepo.createWallet(user.userId);

    return true;
  }
}