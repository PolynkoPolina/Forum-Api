import { Router } from "express";
import type { AuthHandler } from "../handlers/auth";


export function createAuthRouter(authHandler: AuthHandler){
    const router = Router()
    router.post('/register', authHandler.register)
    router.post('/login', authHandler.login)
    return router
}
