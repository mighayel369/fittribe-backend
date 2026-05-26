import { RefreshAccessTokenResponseDTO } from "application/dto/auth/shared/refresh-token.dto";

export const I_REFRESH_ACCESS_TOKEN_TOKEN = Symbol("I_REFRESH_ACCESS_TOKEN_TOKEN");

export interface IRefreshAccessTokenUseCase {
  execute(refreshToken: string): Promise<RefreshAccessTokenResponseDTO>;
}