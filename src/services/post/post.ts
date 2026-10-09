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
            const {title, content, authorId, category } = body
        
            const posts = await postRepo.getAll()
            const existingPost = posts.find(post => post.title === title)
        
            if (existingPost) {
                return 'POST_ALREADY_EXISTS'
            }
        
            const newPost = {
                title: title,
                content: content,
                authorId: authorId,
                category: category
            }
            
            return await postRepo.addPost(newPost)
        }
    }
}