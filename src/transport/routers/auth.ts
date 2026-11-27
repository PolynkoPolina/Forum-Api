import { Router, type RequestHandler } from "express";
import type { AuthHandler } from "../handlers/auth";

export function createAuthRouter(
	authHandler: AuthHandler,
	requireAuth: RequestHandler,
) {
	const router = Router();
	router.post("/register", authHandler.register);
	router.post("/login", authHandler.login);
	router.get("/refresh", authHandler.refresh);
	router.get("/profile", requireAuth, authHandler.getMyProfile);
	router.get("/logout", authHandler.logout);
	return router;
}
