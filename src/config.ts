function required(field: string) {
	const value = process.env[field];
	if (!value) throw new Error(`${field} is not configured`);
	return value;
}

function positiveInt(name: string, fallback: number): number {
	const raw = process.env[name];
	if (raw === undefined || raw === "") return fallback;
	const value = Number(raw);
	if (!Number.isSafeInteger(value) || value <= 0) {
		throw new Error(`${name} must be a positive integer`);
	}
	return value;
}

export const CONFIG = {
	databaseUrl: required("DATABASE_URL"),
	passwordPepper: Buffer.from(required("PASSWORD_PEPPER"), "hex"),
	nodeEnv: required("NODE_ENV"),
	host: required("HOST"),
	port: positiveInt("PORT", 3001),
	corsAllowedUrl: required("CORS_ALLOWED_URL") ?? "http://localhost:5173",
	jwt: {
		secretAccess: required("JWT_SECRET_ACCESS"),
		secretRefresh: required("JWT_SECRET_REFRESH"),
		accessTime: positiveInt("TOKEN_ACCESS_TIME", 15 * 60 * 1000),
		refreshTime: positiveInt("TOKEN_REFRESH_TIME", 7 * 24 * 60 * 60 * 1000),
	},
} as const;

export type Config = typeof CONFIG;
