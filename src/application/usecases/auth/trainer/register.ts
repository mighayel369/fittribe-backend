import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { ICloudinaryService, I_CLOUDINARY_SERVICE_TOKEN } from "domain/services/ICloudinaryService";
import { IOtpService, I_OTP_SERVICE_TOKEN } from "domain/services/IOtpService";
import { IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { RegisterResponseDTO } from "application/dto/auth/shared/register.response.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { UserRole } from "domain/constants/user-role";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { TrainerRegisterRequestDTO } from "application/dto/auth/trainer/trainer.register.dto";
import { CertificatePictureFile } from "application/dto/auth/trainer/certificate-file.schema";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { AuthMapper } from "application/mappers/auth-mapper";

@injectable()
export class TrainerRegisterUseCase implements IRegisterUseCase<TrainerRegisterRequestDTO, CertificatePictureFile> {

  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepository: ITrainerRepo,
    @inject(I_SECURITY_SERVICE_TOKEN) private readonly _securityService: ISecurityService,
    @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly _cloudinaryService: ICloudinaryService,
    @inject(I_OTP_SERVICE_TOKEN) private readonly _otpService: IOtpService
  ) { }

  async execute(registrationRequest: TrainerRegisterRequestDTO, certificateFile?: CertificatePictureFile): Promise<RegisterResponseDTO> {

    await this._ensureEmailIsUnique(registrationRequest.email);

    const hashedPassword = await this._securityService.hashPassword(registrationRequest.password);

    const certificateUrl = await this._uploadTrainerCertificate(certificateFile, registrationRequest.email);

    const trainer = TrainerMapper.toTrainerEntity(
      registrationRequest,
      hashedPassword,
      certificateUrl
    );

    await this._trainerRepository.RegisterTrainer(trainer);

    try {

      await this._initializeAccountVerification(trainer.email);

      return AuthMapper.toRegisterResponseDTO(
        trainer.email
      );

    } catch (error) {

      await this._trainerRepository.deleteTrainer(
        trainer.trainerId
      );

      throw error instanceof AppError
        ? error
        : new AppError(
          ERROR_MESSAGES.ACCOUNT_SETUP_FAILED,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  private async _ensureEmailIsUnique(
    email: string
  ): Promise<void> {

    const existingTrainer = await this._trainerRepository.findTrainerByEmail(email);

    if (
      existingTrainer?.status === true &&
      existingTrainer?.verified === TRAINER_STATUS.ACCEPTED
    ) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
    }
  }

  private async _uploadTrainerCertificate(file: CertificatePictureFile | undefined, email: string): Promise<string | undefined> {

    if (!file) return undefined;
    return await this._cloudinaryService.getTrainerCertificateUrl(file, email);
  }

  private async _initializeAccountVerification(email: string): Promise<void> {

    const isOtpSent = await this._otpService.sendOtp(email, UserRole.TRAINER);

    if (!isOtpSent) {
      throw new AppError(ERROR_MESSAGES.OTP_GENERATE_ERROR, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}