import express from 'express'
import postRouter from './routers/post.js'

const app = express()
app.use(express.json())
app.use('/posts', postRouter)

const HOST = '127.0.0.1'
const PORT = 3001 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
