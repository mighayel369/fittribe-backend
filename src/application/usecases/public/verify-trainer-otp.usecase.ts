import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { VerifyAccountRequestDTO } from "application/dto/public/verify-account.dto";
import { I_SLOT_REPO_TOKEN, ISlotRepo } from "domain/repositories/ISlotRepo";
import { inject,injectable } from "tsyringe";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserRole } from "utils/Constants";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()

export class VerifyTrainerAccountUseCase implements IVerifyAccountUseCase {
  constructor(
    @inject(I_OTP_SERVICE_TOKEN) private readonly _otpService: IOtpService,
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepo: ITrainerRepo,
    @inject(I_SLOT_REPO_TOKEN) private readonly _slotRepo: ISlotRepo,
    @inject(I_WALLET_REPO_TOKEN) private readonly _walletRepo: IWalletRepo,
  ) {}

  async execute(input: VerifyAccountRequestDTO): Promise<boolean> {
    const { email, otp } = input;
    
    const otpRecord = await this._otpService.verifyOtp(email, otp);
    if (!otpRecord || otpRecord.role !== UserRole.TRAINER) {
      throw new AppError("Invalid OTP or unauthorized role", HttpStatus.BAD_REQUEST);
    }
    const trainer=await this._trainerRepo.findTrainerByEmail(email)
    if(!trainer){
      throw new AppError(ERROR_MESSAGES.SOMETHING_WENT_WRONG,HttpStatus.BAD_REQUEST)
    }
  await this._trainerRepo.updateTrainerStatus(trainer.trainerId,true);
    if (!trainer) {
      throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      this._slotRepo.createTrainerSlot(trainer.trainerId),
      this._walletRepo.createWallet(trainer.trainerId)
    ]);

    return true;
  }
}