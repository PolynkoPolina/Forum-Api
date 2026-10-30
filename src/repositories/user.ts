import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { UserRepository } from "../domain/user/repository";
import type { Contract } from "../prisma/contract";

export function createUserRepository(db: PostgresClient<Contract>):UserRepository{
    return{
        async getbyEmail(email){
            return await db.orm.public.User.where({email:email}).first()
        },
        async addUser(data){
            try{
                const user = await db.orm.public.User.create({
                    email: data.email,
                    password: data.password
                })
                const { password, ...publicUser } = user;
                return publicUser;
            } catch (error) {
                if (error instanceof Error && "sqlState" in error) {
                    if (error.sqlState === "23505") { throw new Error("USER_ALREADY_EXISTS");}
                }
                throw error;
            }
        }
    }
}