import type { Config } from "../config";
import { createTokenService } from "../lib/jwt";
import type { Database } from "../prisma/db";
import { createPostRepository } from "../repositories/post";
import { createPostService } from "../services/post/post";
import { createPostHandler } from "../transport/handlers/post";
import { createRequireAuth } from "../transport/middlewares/requireAuth";
import { createPostRouter } from "../transport/routers/post";

export function createPostModule(db:Database, config: Config){
    const tokens = createTokenService(config.jwt);
    const repository = createPostRepository(db)
    const service = createPostService(repository)
    const requireAuth = createRequireAuth(tokens)
    return createPostRouter(createPostHandler(service), requireAuth);
}