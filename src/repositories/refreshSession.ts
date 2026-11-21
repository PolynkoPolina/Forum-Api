import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { RefreshSessionRepository } from "../domain/refreshSession/repository";
import type { Contract } from "../prisma/contract.js"

export function createRefreshSessionRepository(db: PostgresClient<Contract>):RefreshSessionRepository{
    return{
        async getByHash(tokenHash){
           return await db.orm.public.RefreshSession
            .where({ tokenHash:tokenHash })
            .first()
        },
        async rotate(oldTokenHash, newTokenHash, expiresIn){
            await db.orm.public.RefreshSession
            .where({tokenHash: oldTokenHash})
            .update({tokenHash: newTokenHash, expiresIn })
        },
        async create(tokenHash, userId, expiresIn){
            await await db.orm.public.RefreshSession
            .create({ 
                tokenHash: tokenHash,
                userId: userId, 
                expiresIn: expiresIn})
        },
        async deleByHash(tokenHash) {
            await await db.orm.public.RefreshSession
             .where({ tokenHash: tokenHash })
             .delete()
        },
    }
}

