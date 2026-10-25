import type { CategoryRepository } from '../../domain/category/repository.js'
import type { CategoryService } from './category.types.js'

export function createCategoryService(categoryRepo: CategoryRepository): CategoryService{
    return{
        async getAll(name){
            return await categoryRepo.getAll(name)
        },
        
        async getById(id){
            
            if (! await categoryRepo.getById(id)){
                return null
            }
            return await categoryRepo.getById(id)
        },
        
        async addCategory(body) {
        
            const newCategory = {
                name: body.name,
            }
            
            return await categoryRepo.addCategory(newCategory)
        }
    }
}