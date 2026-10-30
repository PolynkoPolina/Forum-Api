import { access } from "node:fs";
import type { UserRepository } from "../../domain/user/repository";
import type { PasswordHasher, AuthService, TokenService } from "./auth.types";

export function createAuthService(userRepository: UserRepository, hasher:PasswordHasher, tokenService: TokenService): AuthService{
    return {
        async login(input){
            const email = input.email.trim().toLowerCase()
            const user = await userRepository.getbyEmail(email)
            if(!user) throw new Error('USER_NOT_FOUND')
            if(!await hasher.verify(user.password, input.password)) throw new Error('WRONG_PASSWORD')
            return {
                user:{ id:user.id, email:user.email},
                tokens: {accessToken: tokenService.signAccessToken(user.id)}
            }
        },
        async register(input){
            const passowordHash = await hasher.hash(input.password)
            const email = input.email.trim().toLowerCase()
            return await userRepository.addUser({email: email, password: passowordHash})
        }
    }
}