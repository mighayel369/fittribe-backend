
import config from "config";

export const getPasswordResetUrl = (token: string): string => {
    return `${config.CLIENT_URL}/reset-password/${token}`;
};

export const getOAuthSuccessUrl = (token: string, user: unknown): string => {
    const url = new URL(`${config.CLIENT_URL}/oauth-success`);
    url.searchParams.append("token", token);
    url.searchParams.append("user", JSON.stringify(user));
    return url.toString();
};

export const getOAuthErrorUrl = (errorType: string): string => {
    return `${config.CLIENT_URL}/login?error=${errorType}`;
};