import express from 'express'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post/post.js'
import { createPostHandler } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'
import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category/category.js'
import { createCategoryRouter } from './transport/routers/category.js'
import { createCategoryHandler } from './transport/handlers/category.js'
import { db } from './prisma/db.js'
import { createuserRepository } from './repositories/user.js'
import { createUserService } from './services/user/user.js'
import { createUserHandler } from './transport/handlers/user.js'
import { hashPassword } from './lib/password.js'
import type { PasswordHasher } from './services/user/user.types.js'
import { createUserRouter } from './transport/routers/user.js'

const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)

const categoryRepository = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepository)
const categoryHandler = createCategoryHandler(categoryService)
const categoryRouter = createCategoryRouter(categoryHandler)

export const passwordHasher: PasswordHasher = {
    hash: hashPassword
};

const userRepository = createuserRepository(db)
const userService = createUserService(userRepository, passwordHasher)
const userHandler = createUserHandler(userService)
const userRouter = createUserRouter(userHandler)


const app = express()
app.use(express.json())
app.use('/posts', postRouter)
app.use('/category', categoryRouter)
app.use('/auth', userRouter)


const HOST = '127.0.0.1'
const PORT = 3001 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
