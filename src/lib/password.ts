import argon2  from "argon2"

export async function hashPassword(passowrd:string){
    const pepper = process.env.PEPPER
    if (!pepper) throw new Error('PEPPER is not defined')
    const pepperBuffer = Buffer.from(pepper)
    const hash = await argon2.hash(passowrd,{
        type:argon2.argon2id,
        memoryCost: 19456,
        timeCost:2,
        parallelism:1,
        secret: pepperBuffer
    })
    return hash
}

export async function verifyPassword(hash: string, password: string) {
    const pepper = process.env.PEPPER
    if (!pepper) throw new Error('PEPPER is not defined')
    return await argon2.verify(hash, password, {
        secret: Buffer.from(pepper)
    })
}