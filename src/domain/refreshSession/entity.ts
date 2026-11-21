export interface RefreshSession{
    id: number
    userId: number
    tokenHash: string
    expiresIn: Date
    createdAt: Date
}