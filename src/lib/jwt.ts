import jwt from "jsonwebtoken"
import { createHash, randomUUID } from "node:crypto"

const accessSecret = process.env.JWT_SECRET_ACCESS
    if(!accessSecret) throw new Error("JWT_ACCESS_SECRET is not defined")

const refreshSecret = process.env.JWT_SECRET_REFRESH
    if(!refreshSecret) throw new Error("JWT_REFRESH_SECRET is not defined")

export function signAccessToken(userId:number):string {
    const token = jwt.sign({},accessSecret!, {
        expiresIn: Number(process.env.TOKEN_ACCESS_TIME),
        algorithm: "HS256",
        subject: String(userId)
    })
    return token
}

export function signRefreshToken(userId:number):string{
    
    const token = jwt.sign({type: "refresh"}, refreshSecret!, {
        expiresIn: Number(process.env.TOKEN_REFRESH_TIME),
        algorithm: "HS256",
        subject: String(userId),
        jwtid: randomUUID()
    })
    return token
}

export function verifyRefreshToken(token:string): number{
    const payload= jwt.verify(token, refreshSecret!, {algorithms: ["HS256"]})
    if(typeof payload == "string" || typeof payload.sub !== "string" ) {
        throw new Error()
    }
    const userId = Number(payload.sub)
    if(Number.isSafeInteger(userId) || userId <= 0 ) throw new Error()
    
    return userId
}


export function verifyAccessToken(token:string): number{
    try{
        const payload= jwt.verify(token, accessSecret!, {algorithms: ["HS256"]})
        if(typeof payload == "string" || typeof payload.sub !== "string" ) {
            throw new Error()
        }
        const userId = Number(payload.sub)
        if(Number.isSafeInteger(userId) || userId <= 0 ) throw new Error()
        
        return userId
    }catch(error){
        throw new Error(String(error))
    }
}

export function hashRefreshToken(token:string): string{
    const hash = createHash("sha256").update(token).digest("hex")
    return hash
}