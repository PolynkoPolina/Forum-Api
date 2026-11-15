import { Router, type RequestHandler } from "express"
import type { PostHandler } from "../handlers/post.js"

export function createPostRouter(postHandler: PostHandler, requireAuth: RequestHandler){
    const router = Router()
    router.get('/', postHandler.getAll)
    router.get('/:id', postHandler.getById)
    router.post('/', postHandler.addPost)
    router.get('/my', requireAuth, postHandler.getByAuthorId)
    return router
}

