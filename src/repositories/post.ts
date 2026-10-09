import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"
import { db } from "../prisma/db.js"

export function createPostRepository():PostRepository{

    return {
        async getAll(category, take) {
            let posts = await db.orm.public.Post.all()
            if(category){
                posts = posts.filter(post => (post.category === category))
            }
            if (take){
                posts =  await db.orm.public.Post.limit(take).all()
            }
            return posts
        },
        
        async getById(id){
            return await db.orm.public.Post.where({id}).first()
        },
        
        async addPost(post){
            return await db.orm.public.Post.create({
                title: post.title,
                content: post.content,
                category: post.category,
                authorId: post.authorId
            })
        }
    }
}




