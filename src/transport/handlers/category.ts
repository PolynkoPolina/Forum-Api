import type { Request, Response } from "express";
import type { CategoryResponse } from "../dto/category/responses";
import type { CategoryError } from "../dto/category/errors";
import type { CategoryRequest } from "../dto/category/requests";
import type { CategoryService } from '../../services/category/category.types'

export interface CategoryHandler{
    getAll(req: Request<{}, {},{}, {name:string}>, res: Response<CategoryResponse[] | CategoryError>): void
    getById(req: Request<{ id:string }, {},{}, {}>, res: Response<CategoryResponse | CategoryError>): void
    addCategory(req: Request<{}, {}, CategoryRequest, {}>, res: Response<CategoryResponse | CategoryError>): void
}

export function createCategoryHandler(categoryService: CategoryService): CategoryHandler{
    return{
        async getAll(req, res) {
            const { name } = req.query
            if (name && typeof name !== 'string'){
                return res.status(400).json({
                    message: 'Wrong name of category'
                })
            }
            const result = await categoryService.getAll(name)
            return res.status(200).json(result)
        },
        
        async getById(req, res){
            const {id} = req.params
            const numId = Number(id)
            if (numId<0 || !Number.isInteger(numId)){
                return res.status(400).json({
                    message:'Wrong id'
                })
            }
            const result = await categoryService.getById(numId)
        
            if (result === null ) {
                return res.status(404).json({
                    message: 'There is no category with this id'
                })
            }
        
            return res.status(200).json(result)
        },
        async addCategory(req, res){
            const body = req.body
            const {name } = body
        
            if (
                typeof name !== 'string' ||
                !name.trim()
            ){
                return res.status(422).json({message:
                    'Invalid category name'
                })
            }
            try{
                const result = await categoryService.addCategory(body)
                return res.status(201).json(result)
        
            } catch(error){
                console.log(error)
                
                if (error === 'CATEGORY_ALREADY_EXISTS' ) {
                    return res.status(409).json({
                        message: 'Conflict. Category with this name already exists'
                    })
                }
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
        }
    }
}

