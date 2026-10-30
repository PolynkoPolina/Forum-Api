import type { Request, Response } from "express";
import type { AuthLoginRequest, AuthRegisterRequest } from "../dto/auth/requests";
import type { AuthLoginResponse, AuthRegisterResponse } from "../dto/auth/responses";
import type { AuthError } from "../dto/auth/errors";
import type { AuthService } from "../../services/auth/auth.types";


export interface AuthHandler{
    register(req: Request<{},{}, AuthRegisterRequest, {}>, res: Response<AuthRegisterResponse | AuthError>): void
    login(req: Request<{},{}, AuthLoginRequest, {}>, res: Response<AuthLoginResponse | AuthError>): void
}

function validation(body:{email:string, password:string}){
    const {email, password} = body
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() || 
        !password.trim() 
    ){
        return false
    }
    return true
}

export function createAuthHandler(authService: AuthService): AuthHandler{
    return{
        async login(req,res){
            if(!validation(req.body)){
                return res.status(422).json({message:
                    'Invalid user data'
                })
            }
            try{
                const result = await authService.login(req.body)

                if (!result) {
                    throw new Error
                }

                const { user, tokens } = result
                res.cookie('accessToken', tokens.accessToken, {
                    httpOnly:true,
                    sameSite: 'lax',
                    maxAge: 15*60*100,
                    path: '/'
                })
                return res.status(200).json(user)

            } catch(error){
                if( error instanceof Error && error.message === 'USER_NOT_FOUND') {
                    return res.status(404).json({
                        message: 'User with this email doesn`t exists'
                    })
                }
                if( error instanceof Error && error.message === 'WRONG_PASSWORD') {
                    return res.status(401).json({
                        message: 'Wrong password'
                    })
                }
                return res.status(500).json({
                    message: "Internal server error"
                })
            }

        },
        async register(req, res){
            if(!validation(req.body)){
                return res.status(422).json({message:
                    'Invalid user data'
                })
            }
            try{
                const result = await authService.register(req.body)
                return res.status(201).json(result)
        
            } catch(error){
                console.log(error)
                
                if (error instanceof Error && error.message === 'USER_ALREADY_EXISTS') {
                    return res.status(409).json({
                        message: 'Conflict. User with this email already exists'
                    })
                }
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
        }
    }
}