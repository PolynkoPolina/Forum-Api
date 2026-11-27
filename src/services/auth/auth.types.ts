import type { RefreshSessionRepository } from "../../domain/refreshSession/repository";
import type {
	CreateUserData,
	PublicUser,
	UserRepository,
} from "../../domain/user/repository";

export interface loginData {
	user: {
		id: number;
		email: string;
	};
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}

export interface refreshData {
	accessToken: string;
	refreshToken: string;
}

export interface AuthService {
	register(input: CreateUserData): Promise<PublicUser>;
	login(input: CreateUserData): Promise<loginData | null>;
	refresh(token: string): Promise<refreshData>;
	getMyProfile(id: number): Promise<PublicUser | null>;
	logout(token: string): Promise<void>;
}

export interface PasswordHasher {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}

export interface TokenService {
	signAccess(userId: number): string;
	signRefresh(userId: number): string;
	verifyAccess(token: string): number;
	verifyRefresh(token: string): number;
	hash(token: string): string;
}

export interface AuthServiceData {
	userRepository: UserRepository;
	passwordHasher: PasswordHasher;
	tokenService: TokenService;
	refreshSessionRepository: RefreshSessionRepository;
    refreshTime: number;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}