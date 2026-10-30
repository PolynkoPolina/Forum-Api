import type { User } from "./entity";

export type CreateUserData = Omit<User, 'id'>
export type PublicUser = Omit<User, 'password'>

export interface UserRepository{
    getbyEmail(email:string): Promise<User | null>,
    addUser(data: CreateUserData): Promise<PublicUser>
}