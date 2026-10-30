import type { CreateUserData, PublicUser } from "../../domain/user/repository";

export interface loginData{
    user:{ 
        id:number,
        email:string
    },
    tokens: {
        accessToken: string
    }
}

export interface AuthService{
    register(input: CreateUserData): Promise<PublicUser>,
    login(input:CreateUserData): Promise<loginData | null> 
}

export interface PasswordHasher {
    hash(password: string): Promise<string>,
    verify(hash: string, password:string): Promise<boolean>
}

export interface TokenService{
    signAccessToken(userId: number): string
}