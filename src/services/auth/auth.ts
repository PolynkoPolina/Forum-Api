import { access } from "node:fs";
import type { UserRepository } from "../../domain/user/repository";
import type { PasswordHasher, AuthService, TokenService, TokenHasher } from "./auth.types";
import type { RefreshSessionRepository } from "../../domain/refreshSession/repository";

export function createAuthService(
    userRepository: UserRepository,
    passwordHasher:PasswordHasher, 
    tokenService: TokenService,
    refreshSessionRepository: RefreshSessionRepository,
    tokenHasher: TokenHasher
    ): AuthService{
    return {
        async login(input){
            const email = input.email.trim().toLowerCase()
            const user = await userRepository.getbyEmail(email)
            if(!user) throw new Error("USER_NOT_FOUND")
            const refreshToken = tokenService.signRefreshToken(user.id)
            const hashRefreshToken = tokenHasher.hash(refreshToken)
            if(!await passwordHasher.verify(user.password, input.password)) throw new Error("WRONG_PASSWORD")
            await refreshSessionRepository.create(hashRefreshToken, user.id, new Date(Date.now()+ 7*24*60*60*1000),)
            return {
                user:{ id:user.id, email:user.email},
                tokens: {
                    accessToken: tokenService.signAccessToken(user.id),
                    refreshToken: refreshToken
                }
            }
        },
        async register(input){
            const passowordHash = await passwordHasher.hash(input.password)
            const email = input.email.trim().toLowerCase()
            const user = await userRepository.addUser({email: email, password: passowordHash})
            return {id: user.id, email: user.email}
        },
        async refresh(token){
            const userId = tokenService.verifyRefreshToken(token)
            const oldRefreshHash = tokenHasher.hash(token)
            const getByHash = await refreshSessionRepository.getByHash(oldRefreshHash)
            if( !getByHash
                ||getByHash.userId !== userId
                || getByHash.expiresIn< new Date()
            ) {
                throw new Error("INVALID_REFRESH_TOKEN")
            }
            const user = await userRepository.getById(userId)
            const newRefreshToken = tokenService.signRefreshToken(userId)
            await refreshSessionRepository.rotate(oldRefreshHash, tokenHasher.hash(newRefreshToken), new Date(Date.now() + 7*24*60*60*1000))
            if(!user) throw new Error("INVALID_REFRESH_TOKEN")
            return{
                accessToken: tokenService.signAccessToken(user.id),
                refreshToken: newRefreshToken
            }
        },
        async getMyProfile(id){
            const user = await userRepository.getById(id)
            if(!user) return null
            const {password, ...publicUser} = user
            return publicUser
        },
        async logout(token){
            if(!token) return
            const hash = tokenHasher.hash(token)
            refreshSessionRepository.deleByHash(hash)
            return
        }
    }
}