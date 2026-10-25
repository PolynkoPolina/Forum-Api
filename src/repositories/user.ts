import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { UserRepository } from "../domain/user/repository";
import type { Contract } from "../prisma/contract";

export function createuserRepository(db: PostgresClient<Contract>):UserRepository{
    return{
        async addUser(data){
            try{
                return  await db.orm.public.User.create({
                    email: data.email,
                    password: data.password
                })
            } catch (error) {
                if (error instanceof Error && "sqlState" in error) {
                    if (error.sqlState === "23505") { throw new Error("USER_ALREADY_EXISTS");}
                }
                throw error;
            }
        }
    }
}