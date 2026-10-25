import type { UserService } from "../../services/user/user.types";
import type { Request, Response } from "express";
import type { UserRegisterResponse } from "../dto/user/responses";
import type { UserError } from "../dto/user/errors";
import type { UserRegisterRequest } from "../dto/user/requests";

export interface UserHandler{
    register(req: Request<{},{}, UserRegisterRequest, {}>, res: Response<UserRegisterResponse | UserError>): void
}

export function createUserHandler(userService: UserService): UserHandler{
    return{
        async register(req, res){
            const body = req.body
            const {email, password} = body
            if (
                typeof email !== 'string' ||
                typeof password !== 'string' ||
                !email.trim() || 
                !password.trim() 
            ){
                return res.status(422).json({message:
                    'Invalid user data'
                })
            }

            try{
                const result = await userService.register(body)
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