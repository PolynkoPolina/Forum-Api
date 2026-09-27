import * as postRepo from '../../repositories/post.js'

export function getAll(category, take){
    return postRepo.getAll(category, take)
}

export function getById(id){
    
    if (!postRepo.getById(id)){
        return 'NO_ID'
    }
    return postRepo.getById(id)
}

export async function addPost(body) {
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