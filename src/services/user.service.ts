import { Prisma, PrismaClient, User } from "@prisma/client";
import {CreateUserDto, LoginUserDto, UserData, UserWithToken } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime";

export interface UserService {
    login(form : LoginUserDto) : Promise<UserWithToken>
    register(form : CreateUserDto) : Promise<UserData | unknown>
    findAll() : Promise<User[]>
}


@injectable()
export class UserServiceImpl implements UserService {

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient : PrismaClient
    ) {

    }
    public async findAll(): Promise<User[]> {
      return await this._prismaClient.user.findMany()
    }

    public async login(form: LoginUserDto): Promise<UserWithToken> {
        const user = await this._prismaClient.user.findUnique({
            where : {
                email : form.email
            }
        })

        return {
           name : "fahmi",
           email : "fahmi@gmail.com",
           access_token : "1234",
           refresh_token : "1122"
        }
    }
    
    public async register(form: CreateUserDto): Promise<UserData | unknown> {
        const newUser = await this._prismaClient.user.create({
            data : form
        })
        return newUser
    }
}