import type { CreateCategoryData, ReturnCategoryData } from "../../domain/category/repository.js";


export interface CategoryService{
    getAll(name:string): Promise<ReturnCategoryData[]>
    getById(id: number): Promise<ReturnCategoryData | null>
    addCategory(input: CreateCategoryData): Promise<ReturnCategoryData | undefined>
}