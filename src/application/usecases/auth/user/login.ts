import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { I_JWT_SERVICE_TOKEN, IJwtService } from "domain/services/i-jwt.service";
import { ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { LoginResponseDTO, LoginRequestDTO, AuthUser } from "application/dto/auth/login.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { AuthMapper } from "application/mappers/auth-mapper";
import { UserRole } from "domain/constants/user-role";

@injectable()
export class UserLoginUseCase implements ILoginUseCase {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService,

    @inject(I_JWT_SERVICE_TOKEN)
    private readonly _jwtService: IJwtService
  ) { }


  async execute(loginRequest: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = loginRequest;


    const userAccount = await this._userRepository.findUserByEmail(email);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (userAccount.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HttpStatus.FORBIDDEN);
    }


    const isPasswordValid = await this._securityService.comparePassword(
      password,
      userAccount.password ?? ""
    );

    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }

    const tokenPayload = {
      id: userAccount.userId,
      email: userAccount.email,
      role: UserRole.USER
    };

    const authenticatedUser: AuthUser = {
      id: userAccount.userId,
      name: userAccount.name,
      email: userAccount.email
    };

    const accessToken = this._jwtService.generateAccessToken(tokenPayload);
    const refreshToken = this._jwtService.generateRefreshToken(tokenPayload);

    return AuthMapper.toLoginResponse(
      accessToken,
      refreshToken,
      UserRole.USER,
      authenticatedUser
    );
  }
}