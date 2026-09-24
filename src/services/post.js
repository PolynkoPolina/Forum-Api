import * as postRepo from '../repositories/post.js'

export function getAll(category, take){
    const numTake = parseInt(take) 

    if (numTake && (!Number.isInteger(numTake) || numTake <= 0)) {
        return 400
    }

    return postRepo.getAll(category, take)
}

export function getById(id){
    id = parseInt(id)
    if (id<0 || !Number.isInteger(id)){
        return 400
    }

    return postRepo.getById(id)
}

export async function addPost(body) {
    const {title, content, author, category } = body

    if (
        typeof title !== 'string' ||
        typeof content !== 'string' ||
        typeof category !== 'string' ||
        typeof author !== 'string' ||
        !title.trim() || 
        !content.trim() ||
        !author.trim() || 
        !category.trim()
    ){
       return 422
    }

    const posts = postRepo.getAll()
    const existingPost = posts.find(post => post.title === title)

    if (existingPost) {
        return 409
    }

    const newPost = {
        title: title,
        content: content,
        author: author,
        category: category
    }
    
    return await postRepo.addPost(newPost)
}