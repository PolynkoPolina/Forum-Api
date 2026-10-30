import express from 'express'
import cors from 'cors'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post/post.js'
import { createPostHandler } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'
import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category/category.js'
import { createCategoryRouter } from './transport/routers/category.js'
import { createCategoryHandler } from './transport/handlers/category.js'
import { db } from './prisma/db.js'
import { createUserRepository } from './repositories/user.js'
import { hashPassword, verifyPassword } from './lib/password.js'
import type { PasswordHasher, TokenService } from './services/auth/auth.types.js'
import { createAuthService } from './services/auth/auth.js'
import { createAuthHandler } from './transport/handlers/auth.js'
import { createAuthRouter } from './transport/routers/auth.js'
import { signAccessToken } from './lib/jwt.js'


const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)

const categoryRepository = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepository)
const categoryHandler = createCategoryHandler(categoryService)
const categoryRouter = createCategoryRouter(categoryHandler)

export const passwordHasher: PasswordHasher = {
    hash: hashPassword,
    verify: verifyPassword
}

export const tokenService: TokenService = {
    signAccessToken: signAccessToken
}

const userRepository = createUserRepository(db)
const authService = createAuthService(userRepository, passwordHasher, tokenService)
const authHandler = createAuthHandler(authService)
const authRouter = createAuthRouter(authHandler)


const app = express()
app.use(express.json())
app.use(cors({origin: 'http://localhost:5173'}))

app.use('/posts', postRouter)
app.use('/category', categoryRouter)
app.use('/auth', authRouter)


const HOST = '127.0.0.1'
const PORT = 3001 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
