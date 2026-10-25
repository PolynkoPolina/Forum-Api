import type { Post } from "../post/entity"

export interface Category {
  id: number
  name:  string
  posts: Post[]
}
