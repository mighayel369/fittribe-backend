import { inject, injectable } from "tsyringe";
import { IAdminRepo, I_ADMIN_REPO_TOKEN } from "domain/repositories/IAdminRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { I_JWT_SERVICE_TOKEN, IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "domain/constants/user-role";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { LoginRequestDTO } from "application/dto/auth/shared/login.request.dto";
import { AuthUserPayloadDTO, LoginResponseDTO } from "application/dto/auth/shared/login.response.dto";
@injectable()
export class AdminLoginUsecase implements ILoginUseCase {
  constructor(
    @inject(I_ADMIN_REPO_TOKEN)
    private readonly _adminRepository: IAdminRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _passwordHasher: ISecurityService,

    @inject(I_JWT_SERVICE_TOKEN)
    private readonly _jwtService: IJwtService
  ) { }

  async execute(loginRequest: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = loginRequest;

    const adminAccount = await this._adminRepository.findAdminByEmail(email);


    if (!adminAccount || !adminAccount.canAuthenticate()) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }


    const isPasswordValid = await this._passwordHasher.comparePassword(password, adminAccount.password!);

    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const tokenPayload = {
      id: adminAccount.adminId,
      email: adminAccount.email,
      role: UserRole.ADMIN,
    };

    const accessToken = this._jwtService.generateAccessToken(tokenPayload);
    const refreshToken = this._jwtService.generateRefreshToken(tokenPayload);

    const authenticatedAdmin: AuthUserPayloadDTO = {
      id: adminAccount.adminId,
      name: adminAccount.name,
      email: adminAccount.email
    };

    return AuthMapper.toLoginResponseDTO(
      accessToken,
      refreshToken,
      UserRole.ADMIN,
      authenticatedAdmin
    );
  }
}