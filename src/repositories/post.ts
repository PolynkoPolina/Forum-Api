import type { Post } from "../domen/post/entity.js"
import type { PostRepository } from "../domen/post/repository.js"

export function createPostRepository():PostRepository{
    let posts: Post[] = [
        {
            id:0,
            title: 'Hello',
            content: 'Hello World',
            author: 'Vika',
            category: 'talking'
        },
        {
            id:1,
            title: 'Cat',
            content: 'Look at my cat!',
            author: 'Polina',
            category: 'cat'
        },
         {
            id:2,
            title: 'One more cat',
            content: 'That is my other cat!',
            author: 'Polina',
            category: 'cat'
        },
    ]

    return {
        getAll(category, take) {
            let postsReturn= [...posts]
            if(category){
                postsReturn = postsReturn.filter(post => (post.category === category))
            }
            if (take){
                postsReturn = postsReturn.slice(0, take)
            }
        
            return postsReturn
        },
        
        getById(id){
            const post = posts.find(post => (post.id== id))
            return post
        },
        
        async addPost(post){
            post.id = posts.length + 1
            posts = [...posts, post]
            return post
        }
    }
}




