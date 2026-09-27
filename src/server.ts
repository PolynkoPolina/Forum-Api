import express from 'express'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post/post.js'
import { createPostHandler } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'

const postRepository = createPostRepository()
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)

const app = express()
app.use(express.json())
app.use('/posts', postRouter)

const HOST = '127.0.0.1'
const PORT = 3001 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
