import { PrismaClient, User, UserToken } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";

export interface UserTokenRepository {
    findByToken(token : string) : Promise<UserToken | null>
    createToken(user : User, token : string) : Promise<UserToken | null>
    findByUser(user : User | null) : Promise<UserToken | null>
    updateToken(user : User, token : string) : Promise<UserToken | null>

}

@injectable()
export class UserTokenRepositoryImpl implements UserTokenRepository {

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient : PrismaClient
    ) {

    }
    public async updateToken(user:User, token: string): Promise<UserToken | null> {
        return await this._prismaClient.userToken.update({
            where : {
                user_id : user.id
            },
            data : {
                token : token
            }
        })
    }
    public async findByUser(user: User): Promise<UserToken | null> {
        return await this._prismaClient.userToken.findFirst({
            where : {
                user_id : user.id
            }
        })
    }
    public async createToken(user: User, token: string): Promise<UserToken | null> {
        return await this._prismaClient.userToken.create({
            data : {
                user_id : user.id,
                token : token
            }
        })
    }

    public async findByToken(token: string): Promise<UserToken | null> {
        return await this._prismaClient.userToken.findFirst({
            where : {
                token : token
            }
        })
    }


}