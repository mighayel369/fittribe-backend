import { IJwtPayload } from "./types/auth.types";

export const I_JWT_SERVICE_TOKEN = Symbol("I_JWT_SERVICE_TOKEN");

export interface IJwtService {
  generateAccessToken(payload: IJwtPayload): string;
  generateRefreshToken(payload: IJwtPayload): string;
  verifyAccessToken(token: string): IJwtPayload; 
  verifyRefreshToken(token: string): IJwtPayload;
}