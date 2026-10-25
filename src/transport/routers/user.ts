import { Router } from "express";
import type { UserHandler } from "../handlers/user";

export function createUserRouter(userHandler: UserHandler){
    const router = Router()
    router.post('/register', userHandler.register)
    return router
}
