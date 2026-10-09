import type { Post } from '../../domain/post/entity.js'
import type { PostService } from '../../services/post/post.types.js';
import type { PostError } from '../dto/post/errors.js';
import type { PostRequest } from '../dto/post/requests.js'
import type { PostResponse } from '../dto/post/responses.js'
import type { Request, Response } from "express";

export interface PostHandler{
    getAll(req: Request<{}, {},{}, {category : string, take: string}>, res: Response<PostResponse[] | PostError>): Promise<Response>
    getById(req: Request<{ id:string }, {},{}, {}>, res: Response<PostResponse | PostError>): Promise<Response>
    addPost(req: Request<{}, {}, PostRequest, {}>, res: Response<PostResponse | PostError>): Promise<Response>
}

export function createPostHandler(postService: PostService): PostHandler{
    return{
        async getAll(req, res) {
            const {category, take} = req.query
            const numTake = Number(take)
            if (category && typeof category !== 'string'){
                return res.status(400).json({
                    message: 'Wrong category'
                })
            }

            if (numTake && (!Number.isInteger(numTake) || numTake <= 0)) {
                return res.status(400).json({
                    message:  'Wrong take'
                })
            }
            const result = await postService.getAll(category, numTake)
        
            return res.status(200).json(result)
        },
        
        async getById(req, res){
            const {id} = req.params
            const numId = Number(id)
            if (numId<0 || !Number.isInteger(numId)){
                return res.status(400).json({
                    message:'Wrong id'
                })
            }
            const result = await postService.getById(numId)
        
            if (result === null ) {
                return res.status(404).json({
                    message: 'There is no post with this id'
                })
            }
        
            return res.status(200).json(result)
        },
        async addPost(req, res){
            const body = req.body
            const {title, content, authorId, category } = body
        
            if (
                typeof title !== 'string' ||
                typeof content !== 'string' ||
                typeof category !== 'string' ||
                typeof authorId !== 'number' ||
                !title.trim() || 
                !content.trim() ||
                authorId < 0 || 
                !category.trim()
            ){
                return res.status(422).json({message:
                    'Invalid product data'
                })
            }
            try{
                const result = await postService.addPost(body)
        
                if (result === 'POST_ALREADY_EXISTS' ) {
                    return res.status(409).json({
                        message: 'Conflict. Post with this title already exists'
                    })
                }
                
                return res.status(201).json(result)
        
            } catch(error){
                console.log(error)
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
        }
    }
}

