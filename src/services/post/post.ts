import type { PostRepository } from '../../domen/post/repository.js'
import type { PostService } from './post.types.js'

export function createPostService(postRepo: PostRepository): PostService{
    return{
        getAll(category, take){
            return postRepo.getAll(category, take)
        },
        
        getById(id){
            
            if (!postRepo.getById(id)){
                return 'NO_ID'
            }
            return postRepo.getById(id)
        },
        
        async addPost(body) {
            const {title, content, author, category } = body
        
        
            const posts = postRepo.getAll()
            const existingPost = posts.find(post => post.title === title)
        
            if (existingPost) {
                return 'POST_ALREADY_EXISTS'
            }
        
            const newPost = {
                title: title,
                content: content,
                author: author,
                category: category
            }
            
            return await postRepo.addPost(newPost)
        }
    }
}