import type { CategoryRepository } from '../../domain/category/repository.js'
import type { CategoryService } from './category.types.js'

export function createCategoryService(categoryRepo: CategoryRepository): CategoryService{
    return{
        async getAll(name){
            const finalName = name.trim().toLowerCase()
            return await categoryRepo.getAll(finalName)
        },
        
        async getById(id){
            
            if (! await categoryRepo.getById(id)){
                return null
            }
            return await categoryRepo.getById(id)
        },
        
        async addCategory(input) {
            const name = input.name.trim().toLowerCase()
            const newCategory = {
                name: name,
            }
            
            return await categoryRepo.addCategory(newCategory)
        }
    }
}