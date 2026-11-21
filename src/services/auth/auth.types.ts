import type { CreateUserData, PublicUser } from "../../domain/user/repository";

export interface loginData{
    user:{ 
        id:number,
        email:string
    },
    tokens: {
        accessToken: string
        refreshToken: string
    }
}

export interface refreshData{
    accessToken : string
    refreshToken: string
}

export interface AuthService{
    register(input: CreateUserData): Promise<PublicUser>
    login(input:CreateUserData): Promise<loginData | null>
    refresh(token: string): Promise<refreshData>
    getMyProfile(id: number): Promise<PublicUser | null>
    logout(token: string): Promise<void>
}

export interface PasswordHasher {
    hash(password: string): Promise<string>,
    verify(hash: string, password:string): Promise<boolean>
}

export interface TokenService{
    signAccessToken(userId: number): string
    signRefreshToken(userId: number): string
    verifyAccessToken(token:string): number
    verifyRefreshToken(token:string) : number
}

export interface TokenHasher{
    hash(token:string): string
}