import * as postService from '../services/post.js'

export function getAll(req, res) {
    const {category, take} = req.query
    const result = postService.getAll(category, take)
  
    if (result == 400 ) {
        return res.status(400).json('Wrong take')
    }

    return res.status(200).json(result)
}

export function getById(req, res){
    const {id} = req.params
    const result = postService.getById(id)

    if (result == 400 ) {
        return res.status(400).json('Wrong id')
    }

    if (result == 404 ) {
        return res.status(404).json('There is no product with this id')
    }

    return res.status(200).json(result)
}

export async function addPost(req, res){
    const body = req.body

    try{
        const result = await postService.addPost(body)

        if (result == 422) {
            return res.status(422).json('Invalid product data')
        }

        if (result == 409) {
            return res.status(409).json('Conflict. Post with this title already exists')
        }
        return res.status(201).json(result)

    } catch(error){
        console.log(error)
        return res.status(500).json("Server's error")
    }
}
