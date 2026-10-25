import type { Category } from "./entity.js";

export type CreateCategoryData = Omit<Category, "id" | "posts">
export type ReturnCategoryData = Omit<Category, 'posts'>

export interface CategoryRepository{
    getAll(name?:string): Promise<ReturnCategoryData[]>
    getById(id: number): Promise<ReturnCategoryData | null >
    addCategory(data:CreateCategoryData): Promise<ReturnCategoryData|undefined>
}