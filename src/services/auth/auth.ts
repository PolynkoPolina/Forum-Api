import type { AuthService, AuthServiceData } from "./auth.types";

export function createAuthService({
	userRepository,
	passwordHasher,
	tokenService,
	refreshSessionRepository,
    refreshTime
}: AuthServiceData ): AuthService {
	return {
		async login(input) {
			const email = input.email.trim().toLowerCase();
			const user = await userRepository.getbyEmail(email);
			if (!user) throw new Error("USER_NOT_FOUND");
			const refreshToken = tokenService.signRefresh(user.id);
			const hashRefreshToken = tokenService.hash(refreshToken);
			if (!(await passwordHasher.verify(user.password, input.password)))
				throw new Error("WRONG_PASSWORD");
			await refreshSessionRepository.create({
				tokenHash: hashRefreshToken,
				userId: user.id,
				expiresIn: new Date(Date.now() + refreshTime),
			});
			return {
				user: { id: user.id, email: user.email },
				tokens: {
					accessToken: tokenService.signAccess(user.id),
					refreshToken: refreshToken,
				},
			};
		},
		async register(input) {
			const passowordHash = await passwordHasher.hash(input.password);
			const email = input.email.trim().toLowerCase();
			const user = await userRepository.addUser({
				email: email,
				password: passowordHash,
			});
			return { id: user.id, email: user.email };
		},
		async refresh(token) {
			const userId = tokenService.verifyRefresh(token);
			const oldRefreshHash = tokenService.hash(token);
			const getByHash =
				await refreshSessionRepository.getByHash(oldRefreshHash);
			if (
				!getByHash ||
				getByHash.userId !== userId ||
				getByHash.expiresIn < new Date()
			) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}
			const user = await userRepository.getById(userId);
			const newRefreshToken = tokenService.signRefresh(userId);
			await refreshSessionRepository.rotate({
				oldTokenHash: oldRefreshHash,
				newTokenHash: tokenService.hash(newRefreshToken),
				expiresIn: new Date(Date.now() + refreshTime),
			});
			if (!user) throw new Error("INVALID_REFRESH_TOKEN");
			return {
				accessToken: tokenService.signAccess(user.id),
				refreshToken: newRefreshToken,
			};
		},
		async getMyProfile(id) {
			const user = await userRepository.getById(id);
			if (!user) return null;
			const { password, ...publicUser } = user;
			return publicUser;
		},
		async logout(token) {
			if (!token) return;
			const hash = tokenService.hash(token);
			refreshSessionRepository.deleByHash(hash);
			return;
		},
	};
}
