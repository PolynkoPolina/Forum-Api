import type { Post } from "./entity.js";



export interface PostRepository{
    getAll(category?:string, take?: number): Post[]
    getById(id: number): Post | undefined
    addPost(post:Post): Promise<Post>
}