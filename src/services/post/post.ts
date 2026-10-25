import type { PostRepository } from '../../domain/post/repository.js'
import type { PostService } from './post.types.js'

export function createPostService(postRepo: PostRepository): PostService{
    return{
        async getAll(category, take){
            return await postRepo.getAll(category, take)
        },
        
        async getById(id){
            
            if (! await postRepo.getById(id)){
                return null
            }
            return await postRepo.getById(id)
        },
        
        async addPost(body) {
            const {title, content, authorId, categoryId } = body

            const newPost = {
                title: title,
                content: content,
                authorId: authorId,
                categoryId: categoryId
            }
            
            return await postRepo.addPost(newPost)
        }
    }
}