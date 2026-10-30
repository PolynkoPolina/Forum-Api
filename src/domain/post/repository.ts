import type { Post } from "./entity.js";

export interface CreatePostData{
    title: string
    content: string
    categoryId: number
    authorId: number
}

export interface PostRepository{
    getAll(category?:string, take?: number): Promise<Post[]>
    getById(id: number): Promise<Post | null >
    addPost(post:CreatePostData): Promise<Post | undefined>
}