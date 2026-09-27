import { Router } from "express"
import type { PostHandler } from "../handlers/post.js"

export function createPostRouter(postHandler: PostHandler){
    const router = Router()
    router.get('/', postHandler.getAll)
    router.get('/:id', postHandler.getById)
    router.post('/',postHandler.addPost)
    
    return router
}

