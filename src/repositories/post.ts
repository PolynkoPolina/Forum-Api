import { isStructuredError } from "@prisma/orm-postgres/utils"
import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"
import { db } from "../prisma/db.js"

export function createPostRepository():PostRepository{

    return {
        async getAll(category, take) {
            let query = db.orm.public.Post.include('category')
            if (category) {
               const foundCategory = await db.orm.public.Category
                    .where({ name: category })
                    .first()
            if (!foundCategory) {
                return []
            }
            query = query.where({ categoryId: foundCategory.id })
            }
            if (take) {
                query = query.limit(Number(take))
            }
            const posts = await query.all()
            return posts
        },
        
        async getById(id){
            return await db.orm.public.Post
            .include("category")
            .where({ id: Number(id) })
            .first();
        },
        
        async addPost(post) {
        try {
            const newPost = await db.orm.public.Post.create({
                title: post.title,
                content: post.content,
                authorId: post.authorId,
                category:  (category) =>
                    category.connect({ id: post.categoryId })
            })
            return newPost

        } catch (error) {
            if (error instanceof Error && "sqlState" in error) {
                if (error.sqlState === "23505") { throw new Error("POST_ALREADY_EXISTS");}
                if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING") { throw new Error("CATEGORY_NOT_FOUND");}
            }

            throw error;
        }
}
    }
}




