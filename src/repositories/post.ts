import { isStructuredError } from "@prisma/orm-postgres/utils"
import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"
import type { PostgresClient } from "@prisma/orm-postgres/runtime"
import type { Contract } from "../prisma/contract.js"

export function createPostRepository(db: PostgresClient<Contract>):PostRepository{

    return {
        async getAll(category, take) {
            let query = db.orm.public.Post
            .include('category')
            .include("author")

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
            return posts.map((post) => {
                const { password, ...publicAuthor } = post.author;
                return {
                    ...post,
                    author: publicAuthor
                };
            });
        },
        
        async getById(id){
            const post = await db.orm.public.Post
            .include("category")
            .include("author")
            .where({ id: Number(id) })
            .first();
        if (!post) {
            return null;
        }
        const { password, ...publicAuthor } = post.author;
        return {
            ...post,
            author: publicAuthor
            };
        },
        
        async addPost(post) {
        try {
            const newPost = await db.orm.public.Post.create({
                title: post.title,
                content: post.content,
                author: (author) =>
                    author.connect({ id: post.authorId }),
                category: (category) =>
                    category.connect({ id: post.categoryId })
            });
            return await this.getById(newPost.id) ?? undefined;

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




