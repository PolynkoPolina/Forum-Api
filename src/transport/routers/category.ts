import { Router } from "express"
import type { CategoryHandler } from "../handlers/category"


export function createCategoryRouter(categoryHandler: CategoryHandler){
    const router = Router()
    router.get('/', categoryHandler.getAll)
    router.get('/:id', categoryHandler.getById)
    router.post('/', categoryHandler.addCategory)
    
    return router
}

