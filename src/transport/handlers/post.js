import * as postService from '../../services/post/post.js'

export function getAll(req, res) {
    const {category, take} = req.query
    const numTake = Number(take)

    if (numTake && (!Number.isInteger(numTake) || numTake <= 0)) {
        return res.status(400).json('Wrong take')
    }
    const result = postService.getAll(category, take)

    return res.status(200).json(result)
}

export function getById(req, res){
    const {id} = req.params
    id = Number(id)
    if (id<0 || !Number.isInteger(id)){
        return res.status(400).json('Wrong id')
    }
    const result = postService.getById(id)

    if (result === 'NO_ID' ) {
        return res.status(404).json('There is no post with this id')
    }

    return res.status(200).json(result)
}

export async function addPost(req, res){
    const body = req.body
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
        return res.status(422).json('Invalid product data')
    }
    try{
        const result = await postService.addPost(body)

        if (result === 'POST_ALREADY_EXISTS' ) {
            return res.status(409).json('Conflict. Post with this title already exists')
        }
        
        return res.status(201).json(result)

    } catch(error){
        console.log(error)
        return res.status(500).json("Internal server error")
    }
}
