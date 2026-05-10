import { container } from "tsyringe";
import { IGoogleAuthService, I_GOOGLE_AUTH_SERVICE_TOKEN } from "domain/services/IGoogleAuthService";
import logger from "utils/logger";
export const passportSet = async (): Promise<boolean> => {
  try {
    const passportSetup = container.resolve<IGoogleAuthService>(I_GOOGLE_AUTH_SERVICE_TOKEN);
    await passportSetup.initializeStrategy();
    return true;
  } catch (err) {
    logger.error("❌ Passport setup failed", err instanceof Error ? err : { message: String(err) });
    return false;
  }
};
