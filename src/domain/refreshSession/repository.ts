import type { RefreshSession } from "./entity";

type createData = {
	tokenHash: string;
	userId: number;
	expiresIn: Date;
};
type rotateData = {
	oldTokenHash: string;
	newTokenHash: string;
	expiresIn: Date;
};

export interface RefreshSessionRepository {
	getByHash(tokenHash: string): Promise<RefreshSession | null>;
	rotate(data: rotateData): Promise<void>;
	create(data: createData): Promise<void>;
	deleByHash(tokenHash: string): Promise<void>;
}
