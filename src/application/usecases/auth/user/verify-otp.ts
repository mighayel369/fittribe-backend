import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserRole } from "domain/constants/user-role";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class VerifyUserAccountUseCase implements IVerifyAccountUseCase {
  constructor(
    @inject(I_OTP_SERVICE_TOKEN)
    private readonly _otpService: IOtpService,

    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo,
  ) { }

  async execute(verificationRequest: VerifyAccountRequestDTO): Promise<boolean> {
    const { email, otp } = verificationRequest;

    const otpRecord = await this._otpService.verifyOtp(email, otp);

    if (!otpRecord || otpRecord.role !== UserRole.USER) {
      throw new AppError(
        ERROR_MESSAGES.OTP_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }

    const userAccount = await this._userRepository.findUserByEmail(email);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._userRepository.updateUserStatus(userAccount.userId, true);

    await this._walletRepository.createWallet(userAccount.userId);

    return true;
  }
}