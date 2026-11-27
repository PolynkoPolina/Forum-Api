import type { Config } from "../config";
import { createTokenService } from "../lib/jwt";
import { createPasswordHasher } from "../lib/password";
import type { Database } from "../prisma/db";
import { createRefreshSessionRepository } from "../repositories/refreshSession";
import { createUserRepository } from "../repositories/user";
import { createAuthService } from "../services/auth/auth";
import { createAuthHandler } from "../transport/handlers/auth";
import { createRequireAuth } from "../transport/middlewares/requireAuth";
import { createAuthRouter } from "../transport/routers/auth";

export function createAuthModule(db: Database, config: Config) {
	const tokens = createTokenService(config.jwt);
	const service = createAuthService({
		userRepository: createUserRepository(db),
		passwordHasher: createPasswordHasher(config.passwordPepper),
		tokenService: tokens,
		refreshSessionRepository: createRefreshSessionRepository(db),
		refreshTime: config.jwt.refreshTime,
	});
	const requireAuth = createRequireAuth(tokens);
	return createAuthRouter(createAuthHandler(service), requireAuth);
}
