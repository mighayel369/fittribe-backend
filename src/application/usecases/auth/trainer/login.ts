import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { I_JWT_SERVICE_TOKEN, IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO, LoginRequestDTO, AuthUser } from "application/dto/auth/login.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "domain/constants/user-role";

@injectable()
export class TrainerLoginUseCase implements ILoginUseCase {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService,

    @inject(I_JWT_SERVICE_TOKEN)
    private readonly _jwtService: IJwtService
  ) { }

  async execute(loginRequest: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = loginRequest;


    const trainerAccount = await this._trainerRepository.findTrainerByEmail(email);

    if (!trainerAccount) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    if (trainerAccount.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.TRAINER_BLOCKED, HttpStatus.FORBIDDEN);
    }

    if (!trainerAccount.password) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }


    const isPasswordValid = await this._securityService.comparePassword(
      password,
      trainerAccount.password
    );

    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }


    const tokenPayload = {
      id: trainerAccount.trainerId!,
      email: trainerAccount.email,
      role: UserRole.TRAINER
    };

    const authenticatedTrainer: AuthUser = {
      id: trainerAccount.trainerId,
      name: trainerAccount.name,
      email: trainerAccount.email
    };

    const accessToken = this._jwtService.generateAccessToken(tokenPayload);
    const refreshToken = this._jwtService.generateRefreshToken(tokenPayload);

    return AuthMapper.toLoginResponse(
      accessToken,
      refreshToken,
      UserRole.TRAINER,
      authenticatedTrainer
    );
  }
}