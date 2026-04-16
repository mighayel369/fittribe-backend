import { RefreshTokenResponseDTO } from "../../dto/public/refresh-token.response.dto";

export const I_REFRESH_ACCESS_TOKEN_TOKEN = Symbol("I_REFRESH_ACCESS_TOKEN_TOKEN");

export interface IRefreshAccessTokenUseCase {
  execute(refreshToken: string): Promise<RefreshTokenResponseDTO>;
}