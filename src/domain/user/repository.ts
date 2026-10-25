import type { User } from "./entity";

export type CreateUserData = Omit<User, 'id'>
export type ReturnUserData = Omit<User, 'password'>

export interface UserRepository{
    addUser(data: CreateUserData): Promise<ReturnUserData>
}