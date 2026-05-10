import { inject, injectable } from "tsyringe";
import { randomUUID } from "crypto";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { UserRegisterRequestDTO, RegisterResponseDTO } from "application/dto/auth/register.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserRole } from "domain/constants/user-role";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import logger from "utils/logger";
@injectable()
export class UserRegisterUseCase implements IRegisterUseCase<UserRegisterRequestDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService,

    @inject(I_OTP_SERVICE_TOKEN)
    private readonly _otpService: IOtpService
  ) { }

  async execute(registrationRequest: UserRegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { email, password, name } = registrationRequest;

    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const hashedInitialPassword = await this._securityService.hashPassword(password);

    const newUser = new UserEntity(
      name,
      email,
      randomUUID(),
      UserRole.USER,
      hashedInitialPassword
    );

    const savedUser = await this._userRepository.registerUser(newUser);

    if (!savedUser || !savedUser.userId) {
      throw new AppError(ERROR_MESSAGES.USER_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const isOtpSentSuccessfully = await this._otpService.sendOtp(savedUser.email, UserRole.USER);

      if (!isOtpSentSuccessfully) {
        throw new AppError(ERROR_MESSAGES.OTP_GENERATE_ERROR,HttpStatus.BAD_REQUEST);
      }

      return { email: savedUser.email };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Registration failed for ${savedUser.email}. Reason: ${errorMessage}`);

      if (savedUser.userId) {
        await this._userRepository.removeUser(savedUser.userId);
        logger.info(`Cleanup successful: Removed user ${savedUser.email} due to registration failure.`);
      }

      throw new AppError(
        ERROR_MESSAGES.ACCOUNT_SETUP_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}