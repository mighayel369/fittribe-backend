import { inject, injectable } from "tsyringe";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserRole } from "domain/constants/user-role";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class VerifyTrainerAccountUseCase implements IVerifyAccountUseCase {
  constructor(
    @inject(I_OTP_SERVICE_TOKEN)
    private readonly _otpService: IOtpService,

    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,

    @inject(I_SLOT_REPO_TOKEN)
    private readonly _slotRepository: ISlotRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo,
  ) { }


  async execute(verificationRequest: VerifyAccountRequestDTO): Promise<boolean> {
    const { email, otp } = verificationRequest;

    const otpRecord = await this._otpService.verifyOtp(email, otp);

    if (!otpRecord || otpRecord.role !== UserRole.TRAINER) {
      throw new AppError(ERROR_MESSAGES.OTP_INVALID, HttpStatus.BAD_REQUEST);
    }

    const trainerAccount = await this._trainerRepository.findTrainerByEmail(email);

    if (!trainerAccount) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._trainerRepository.updateTrainerStatus(trainerAccount.trainerId, true);

    await Promise.all([
      this._slotRepository.createTrainerSlot(trainerAccount.trainerId),
      this._walletRepository.createWallet(trainerAccount.trainerId)
    ]);

    return true;
  }
}