import { inject, injectable } from "tsyringe";
import { IAdminRepo,I_ADMIN_REPO_TOKEN } from "domain/repositories/IAdminRepo";
import { I_PASSWORD_HASHER_TOKEN, IPasswordHasher } from "domain/services/IPasswordHasher";
import { I_JWT_SERVICE_TOKEN, IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO, LoginRequestDTO, AuthUser } from "application/dto/auth/login.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "utils/Constants";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class AdminLoginUsecase implements ILoginUseCase {
  constructor(
    @inject(I_ADMIN_REPO_TOKEN) private _AdminRepo: IAdminRepo,
    @inject(I_PASSWORD_HASHER_TOKEN) private _passwordHasher: IPasswordHasher,
    @inject(I_JWT_SERVICE_TOKEN) private _jwtService: IJwtService 
  ) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;

    const admin = await this._AdminRepo.findAdminByEmail(email);
console.log(admin)
    if (!admin || !admin.canAuthenticate()) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const isMatch = await this._passwordHasher.compare(password, admin.password!);

    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: admin.adminId,
      email: admin.email,
      role: UserRole.ADMIN,
    };

    let AuthAdmin:AuthUser={
      id:admin.adminId,
      name:admin.name,
      email:admin.email
    }

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);
    console.log(refreshToken)
    return AuthMapper.toLoginResponse(accessToken, refreshToken,UserRole.ADMIN,AuthAdmin);
  }
}