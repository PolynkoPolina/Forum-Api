import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { RefreshSessionRepository } from "../domain/refreshSession/repository";
import type { Contract } from "../prisma/contract.js";

export function createRefreshSessionRepository(
	db: PostgresClient<Contract>,
): RefreshSessionRepository {
	return {
		async getByHash(tokenHash) {
			return await db.orm.public.RefreshSession.where({
				tokenHash: tokenHash,
			}).first();
		},
		async rotate(data) {
			await db.orm.public.RefreshSession.where({
				tokenHash: data.oldTokenHash,
			}).update({ tokenHash: data.newTokenHash, expiresIn: data.expiresIn });
		},
		async create(data) {
			await await db.orm.public.RefreshSession.create({
				tokenHash: data.tokenHash,
				userId: data.userId,
				expiresIn: data.expiresIn,
			});
		},
		async deleByHash(tokenHash) {
			await await db.orm.public.RefreshSession.where({
				tokenHash: tokenHash,
			}).delete();
		},
	};
}
