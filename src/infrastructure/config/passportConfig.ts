import { container } from "tsyringe";
import { IGoogleAuthService,I_GOOGLE_AUTH_SERVICE_TOKEN } from "domain/services/IGoogleAuthService";

export const passportSet = async (): Promise<boolean> => {
  try {
    const passportSetup = container.resolve<IGoogleAuthService>(I_GOOGLE_AUTH_SERVICE_TOKEN );
    await passportSetup.initializeStrategy();
    return true;
  } catch (err) {
    console.error("❌ Error in passport setup:", err);
    return false;
  }
};
