import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IVerifyAccountUseCase } from "application/interfaces/auth/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/auth/shared/verify-account.dto";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserRole } from "domain/constants/user-role";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class VerifyUserAccountUseCase
  implements IVerifyAccountUseCase {

  constructor(

    @inject(I_OTP_SERVICE_TOKEN)
    private readonly _otpService: IOtpService,

    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo,

  ) { }

  async execute(verificationRequest: VerifyAccountRequestDTO): Promise<void> {

    const { email, otp } = verificationRequest;
    const verifiedOtpRecord = await this._otpService.verifyOtp(email, otp);

    if (
      !verifiedOtpRecord ||
      verifiedOtpRecord.role !== UserRole.USER
    ) {
      throw new AppError(ERROR_MESSAGES.OTP_FAILED, HttpStatus.BAD_REQUEST);
    }

    const userAccount = await this._userRepository.findUserByEmail(email);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._userRepository.updateUserStatus(userAccount.userId, true);
    await this._walletRepository.createWallet(userAccount.userId);
  }
}