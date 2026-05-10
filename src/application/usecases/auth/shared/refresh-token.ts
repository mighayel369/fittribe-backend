import { inject, injectable } from "tsyringe";
import { IRefreshAccessTokenUseCase } from "application/interfaces/public/i-refresh-access-token.usecase";
import { I_JWT_SERVICE_TOKEN, IJwtService } from "domain/services/i-jwt.service";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { RefreshTokenResponseDTO } from "application/dto/public/refresh-token.response.dto";
@injectable()
export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase {
  constructor(
    @inject(I_JWT_SERVICE_TOKEN)
    private readonly _jwtService: IJwtService
  ) { }

  async execute(refreshToken: string): Promise<RefreshTokenResponseDTO> {
    const decodedTokenPayload = this._jwtService.verifyRefreshToken(refreshToken);


    const newAccessToken = this._jwtService.generateAccessToken({
      id: decodedTokenPayload.id,
      email: decodedTokenPayload.email,
      role: decodedTokenPayload.role
    });

    if (!newAccessToken) {
      throw new AppError(
        ERROR_MESSAGES.ACCESS_TOKEN_GENERATING_FAILURE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      accessToken: newAccessToken,
      role: decodedTokenPayload.role
    };
  }
}