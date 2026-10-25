import type { UserRepository } from "../../domain/user/repository";
import type { PasswordHasher, UserService } from "./user.types";

export function createUserService(userRepository: UserRepository, hasher:PasswordHasher): UserService{
    return {
        async register(input){
            const passowordHash = await hasher.hash(input.password)
            return await userRepository.addUser({email: input.email, password: passowordHash})
        }
    }
}