import config from "config";
export const COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: config.COOKIE_MAX_AGE 
};