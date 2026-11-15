import type { RequestHandler } from "express"

export function createRequireAuth(verifyAccessToken: (token:string)=> number):RequestHandler{
    return (req, res, next) =>{
        const {accessToken} = req.cookies
        const userId = verifyAccessToken(accessToken)
        res.locals.userId = userId
        next()
    }
}