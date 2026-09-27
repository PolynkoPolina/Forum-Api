import type { Post } from "../../domen/post/entity.js";

export interface CreatePostData{
    
}

export interface PostService{
    getAll(category?:string, take?: number): Post[]
    getById(id: number): Post | undefined | 'NO_ID'
    addPost(body: Post): Promise<Post | 'POST_ALREADY_EXISTS'>
}