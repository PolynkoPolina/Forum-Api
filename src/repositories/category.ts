import type { Post } from "../domain/post/entity.js"
import type { CategoryRepository } from "../domain/category/repository.js"
import { db } from "../prisma/db.js"
import { isStructuredError } from "@prisma/orm-postgres/utils"

export function createCategoryRepository(): CategoryRepository{

    return {
        async getAll(name) {
            if (name) {
                return await db.orm.public.Category.where({ name: name }).all()
            }
            return await db.orm.public.Category.all()
        },
        
        async getById(id){
            return await db.orm.public.Category.where({id}).first()
        },
        
        async addCategory(data){
            try{
                return await db.orm.public.Category.create({
                    name: data.name
                })
            } 
            catch(error){
                if (error instanceof Error && "sqlState" in error){
                    if (error.sqlState === "23505") throw new Error("CATEGORY_ALREADY_EXISTS");
                    if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING"){throw new Error("CATEGORY_NOT_FOUND");}
                } 

            }
        }
    }
}




