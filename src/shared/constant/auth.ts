import { ROUTES } from "./routes";

export const AUTH_COOKIE = {
	ACCESS: "accessToken",
	REFRESH: "refreshToken",
} as const;

export const REFRESH_COOKIE_PATH = ROUTES.AUTH;