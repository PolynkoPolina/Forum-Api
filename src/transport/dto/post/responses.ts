import type { ReturnCategoryData } from "../../../domain/category/repository"
import type { PublicUser } from "../../../domain/user/repository"

export interface PostResponse{
    id: number
    title: string
    content: string
    category: ReturnCategoryData
    author: PublicUser
}