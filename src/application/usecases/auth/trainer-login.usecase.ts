
import { inject, injectable } from "tsyringe";
import { ITrainerRepo,I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { I_PASSWORD_HASHER_TOKEN, IPasswordHasher } from "domain/services/IPasswordHasher";
import { I_JWT_SERVICE_TOKEN, IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO,LoginRequestDTO, AuthUser } from "application/dto/auth/login.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "utils/Constants";
@injectable()
export class TrainerLoginUseCase implements ILoginUseCase {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepo: ITrainerRepo,
    @inject(I_PASSWORD_HASHER_TOKEN) private readonly _passwordHasher: IPasswordHasher,
    @inject(I_JWT_SERVICE_TOKEN) private _jwtService: IJwtService
  ) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;
console.log(input)
    const trainer = await this._trainerRepo.findTrainerByEmail(email);

    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!trainer.password) {
    throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    if (trainer.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.TRAINER_BLOCKED, HttpStatus.FORBIDDEN);
    }



    const isMatch = await this._passwordHasher.compare(password, trainer.password);
    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const payload = { id: trainer.trainerId!, email: trainer.email, role: UserRole.TRAINER };
    
    let AuthTrainer:AuthUser={
      id:trainer.trainerId,
      name:trainer.name,
      email:trainer.email
    }

    return AuthMapper.toLoginResponse(this._jwtService.generateAccessToken(payload),
     this._jwtService.generateRefreshToken(payload),UserRole.TRAINER,AuthTrainer);
  }
}