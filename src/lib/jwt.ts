import jwt from 'jsonwebtoken'

export function signAccessToken(userId:number){
    const secretKey = process.env.JWT_SECRET_ACCESS
    if(!secretKey) throw new Error('SECRET KEY is not defined')
    const token = jwt.sign({},secretKey, {
        expiresIn: 15 * 60 * 100,
        algorithm: 'HS256',
        subject: String(userId)
    })
    return token
}