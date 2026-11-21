import type { RequestHandler } from "express"

export function createRequireAuth(verifyAccessToken: (token:string)=> number):RequestHandler{
    return (req, res, next) =>{
        const {accessToken} = req.cookies
        if(!accessToken) throw new Error("NO_ACCESS_TOKEN_IN_COOKIES")
        const userId = verifyAccessToken(accessToken)
        res.locals.userId = userId
        next()
    }
}