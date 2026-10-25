import type { CreateUserData, ReturnUserData } from "../../domain/user/repository";

export interface UserService{
    register(input: CreateUserData): Promise<ReturnUserData>
}
export interface PasswordHasher {
    hash(password: string): Promise<string>
}

