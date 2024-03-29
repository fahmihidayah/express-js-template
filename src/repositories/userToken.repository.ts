import 'reflect-metadata';
import { Prisma, PrismaClient, User, UserToken } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { provide } from 'inversify-binding-decorators';

export interface UserTokenRepository {
    findByToken(token : string) : Promise<UserToken | null>
    createToken(user : User, token : string) : Promise<UserToken | null>
    findByUser(user : User | null) : Promise<UserToken | null>
    updateToken(user : User, token : string) : Promise<UserToken | null>
    deleteByUser(user : User) : Promise<boolean>

}

@provide(UserTokenRepositoryImpl)
export class UserTokenRepositoryImpl implements UserTokenRepository {

    private _userToken : Prisma.UserTokenDelegate

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient : PrismaClient
    ) {
        this._userToken = _prismaClient.userToken
    }

    public async deleteByUser(user: User): Promise<boolean> {
        const result = await this._userToken.delete({
            where : {
                user_id : user.id
            }});
        return result !== null
    }
    public async updateToken(user:User, token: string): Promise<UserToken | null> {
        return await this._userToken.update({
            where : {
                user_id : user.id
            },
            data : {
                token : token
            }
        })
    }
    public async findByUser(user: User): Promise<UserToken | null> {
        return await this._userToken.findFirst({
            where : {
                user_id : user.id
            }
        })
    }
    public async createToken(user: User, token: string): Promise<UserToken | null> {
        return await this._userToken.create({
            data : {
                user_id : user.id,
                token : token
            }
        })
    }

    public async findByToken(token: string): Promise<UserToken | null> {
        return await this._userToken.findFirst({
            where : {
                token : token
            }
        })
    }


}