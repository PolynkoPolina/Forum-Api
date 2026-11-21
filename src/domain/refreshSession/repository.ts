import type { RefreshSession } from "./entity";

export interface RefreshSessionRepository{
    getByHash(tokenHash:string): Promise<RefreshSession | null>,
    rotate(oldTokenHash: string, newTokenHash: string, expiresIn:Date): Promise<void>,
    create(tokenHash:string, userId: number, expiresIn:Date): Promise<void>,
    deleByHash(tokenHash:string) : Promise<void>
}