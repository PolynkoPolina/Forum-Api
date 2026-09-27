import type { Post } from '../../domen/post/entity.js'
import type { PostService } from '../../services/post/post.types.js';
import type { PostError } from '../dto/post/errors.js';
import type { PostRequest } from '../dto/post/requests.js'
import type { PostResponse } from '../dto/post/responses.js'
import type { Request, Response } from "express";

export interface PostHandler{
    getAll(req: Request, res: Response): Response
    getById(req: Request, res: Response<PostResponse | string>): Response
    addPost(req: Request<PostRequest>, res: Response): Promise<Response>
}

export function createPostHandler(postService: PostService): PostHandler{
    return{
        getAll(req, res) {
            const {category, take} = req.query
            const numTake = Number(take)
            if (category && typeof category !== 'string'){
                return res.status(400).json('Wrong category')
            }

            if (numTake && (!Number.isInteger(numTake) || numTake <= 0)) {
                return res.status(400).json('Wrong take')
            }
            const result = postService.getAll(category, numTake)
        
            return res.status(200).json(result)
        },
        
        getById(req, res){
            const {reqId} = req.params
            const id = Number(reqId)
            if (id<0 || !Number.isInteger(id)){
                return res.status(400).json('Wrong id')
            }
            const result = postService.getById(id)
        
            if (result === 'NO_ID' ) {
                return res.status(404).json('There is no post with this id')
            }
        
            return res.status(200).json(result)
        },
        async addPost(req, res){
            const body = req.body
            const {title, content, author, category } = body
        
            if (
                typeof title !== 'string' ||
                typeof content !== 'string' ||
                typeof category !== 'string' ||
                typeof author !== 'string' ||
                !title.trim() || 
                !content.trim() ||
                !author.trim() || 
                !category.trim()
            ){
                return res.status(422).json('Invalid product data')
            }
            try{
                const result = await postService.addPost(body)
        
                if (result === 'POST_ALREADY_EXISTS' ) {
                    return res.status(409).json('Conflict. Post with this title already exists')
                }
                
                return res.status(201).json(result)
        
            } catch(error){
                console.log(error)
                return res.status(500).json("Internal server error")
            }
        }
    }
}

