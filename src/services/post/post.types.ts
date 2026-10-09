import type { Post } from "../../domain/post/entity.js";
import type { CreatePostData } from "../../domain/post/repository.js";


export interface PostService{
    getAll(category?:string, take?: number): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    addPost(body: CreatePostData): Promise<Post | 'POST_ALREADY_EXISTS'>
}