import config from "config";
import { NODE_ENV } from "./Constants";

export const COOKIE_CONFIG = {
    httpOnly: true,
    secure: config.NODE_ENV === NODE_ENV.PRODUCTION,
    sameSite: "none" as const,
    maxAge: config.COOKIE_MAX_AGE,
};