import type { Post } from "./entity.js";

export type CreatePostData = Omit<Post, "id">


export interface PostRepository{
    getAll(category?:string, take?: number): Promise<Post[]>
    getById(id: number): Promise<Post | null >
    addPost(post:CreatePostData): Promise<Post>
}