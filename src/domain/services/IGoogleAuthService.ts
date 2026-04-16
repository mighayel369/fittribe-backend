
export const I_GOOGLE_AUTH_SERVICE_TOKEN = Symbol("I_GOOGLE_AUTH_SERVICE_TOKEN");
export interface IGoogleAuthService {
  initializeStrategy(): void
}