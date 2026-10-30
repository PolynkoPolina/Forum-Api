import { InternalError } from "@prisma/orm-postgres/utils"
import type { Category } from "../category/entity"
import type { User } from "../user/entity"
import type { PublicUser } from "../user/repository"
import type { ReturnCategoryData } from "../category/repository"

export interface Post{
    id: number
    title: string
    content: string
    category: ReturnCategoryData
    author: PublicUser
}
