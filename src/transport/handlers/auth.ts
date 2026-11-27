import type { Request, Response } from "express";
import type {
	AuthLoginRequest,
	AuthRegisterRequest,
} from "../dto/auth/requests";
import type {
	AuthLoginResponse,
	AuthRegisterResponse,
} from "../dto/auth/responses";
import type { AuthService } from "../../services/auth/auth.types";
import { clearAuthCookies, setAuthCookies } from "../cookies/authCookies";
import type { ErrorData } from "../dto/errrors/error";

export interface AuthHandler {
	register(
		req: Request<{}, {}, AuthRegisterRequest, {}>,
		res: Response<AuthRegisterResponse | ErrorData>,
	): void;
	login(
		req: Request<{}, {}, AuthLoginRequest, {}>,
		res: Response<AuthLoginResponse | ErrorData>,
	): void;
	refresh(req: Request, res: Response): void;
	getMyProfile(
		req: Request,
		res: Response<AuthLoginResponse | ErrorData>,
	): void;
	logout(req: Request, res: Response): void;
}

function validation(body: { email: string; password: string }) {
	const { email, password } = body;
	if (
		typeof email !== "string" ||
		typeof password !== "string" ||
		!email.trim() ||
		!password.trim()
	) {
		return false;
	}
	return true;
}

export function createAuthHandler(authService: AuthService): AuthHandler {
	return {
		async login(req, res) {
			if (!validation(req.body)) {
				return res.status(422).json({ message: "Invalid user data" });
			}
			try {
				const result = await authService.login(req.body);
				if (!result) {
					throw new Error();
				}
				const { user, tokens } = result;
				setAuthCookies(res, tokens);
				return res.status(200).json(user);
			} catch (error) {
				if (error instanceof Error && error.message === "USER_NOT_FOUND") {
					return res.status(404).json({
						message: "User with this email doesn`t exists",
					});
				}
				if (error instanceof Error && error.message === "WRONG_PASSWORD") {
					return res.status(401).json({
						message: "Wrong password",
					});
				}
				return res.status(500).json({
					message: "Internal server error",
				});
			}
		},
		async register(req, res) {
			if (!validation(req.body)) {
				return res.status(422).json({ message: "Invalid user data" });
			}
			try {
				const result = await authService.register(req.body);
				return res.status(201).json(result);
			} catch (error) {
				console.log(error);

				if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
					return res.status(409).json({
						message: "Conflict. User with this email already exists",
					});
				}
				return res.status(500).json({
					message: "Internal server error",
				});
			}
		},
		async refresh(req, res) {
			try {
				const { refreshToken } = req.cookies;
				if (typeof refreshToken !== "string") {
					return res.status(401).json({ message: "Not authorized" });
				}
				const result = await authService.refresh(refreshToken);
				setAuthCookies(res, result);
				res.status(200).json({
					message: "Success",
				});
			} catch (error) {
				console.log(error);
				return res.status(500).json({
					message: "Internal server error",
				});
			}
		},
		async getMyProfile(_req, res) {
			try {
				const userId = res.locals.userId;
				const result = await authService.getMyProfile(userId);
				if (!result) {
					return res.status(400).json({
						message: "Not authorized",
					});
				}
				return res.status(200).json(result);
			} catch (error) {
				console.log(error);
				return res.status(500).json({
					message: "Internal server error",
				});
			}
		},
		async logout(req, res) {
			const token = req.cookies?.refreshToken;
			try {
				if (typeof token !== "string" && token.length < 0) {
					res.status(401).json({ message: "unauthorized" });
					return;
				}
				await authService.logout(token);
				clearAuthCookies(res);
				res.status(200).json({ message: "Success" });
			} catch (error) {
				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
