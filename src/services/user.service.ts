import { Prisma, PrismaClient, User } from "@prisma/client";
import {CreateUserDto, LoginUserDto, UserData, UserWithToken } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../containers/prisma.container";
import { GetResult } from "@prisma/client/runtime";

export interface UserService {
    login(loginForm : LoginUserDto) : Promise<UserWithToken>
    register(registerForm : CreateUserDto) : Promise<UserData>
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



    public async login(loginForm: LoginUserDto): Promise<UserWithToken> {
        
        return {
           name : "fahmi",
           email : "fahmi@gmail.com",
           access_token : "1234",
           refresh_token : "1122"
        }
    }
    
    public async register(registerForm: CreateUserDto): Promise<UserData> {
        return {
            id : "1",
            name : "fahmi",
            email : "1234"
        }
    }
}