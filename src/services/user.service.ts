import { Prisma, PrismaClient, User } from "@prisma/client";
import {CreateUserDto, LoginUserDto, UserData, UserWithToken } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime";
import { TYPE_REPOSITORY } from "../repositories";
import { UserRepository } from "../repositories/user.repository";

export interface UserService {
    login(form : LoginUserDto) : Promise<UserWithToken>
    register(form : CreateUserDto) : Promise<UserData | unknown>
    findAll() : Promise<User[]>
    findById(id : number) : Promise<UserData | unknown>
}


@injectable()
export class UserServiceImpl implements UserService {

    constructor(
        @inject(TYPE_REPOSITORY.UserRepository) private _userRepository : UserRepository
    ) {

    }
    public async findById(id : number): Promise<UserData | unknown> {
        return await this._userRepository.findById(id)
    }
    public async findAll(): Promise<User[]> {
      return await this._userRepository.findAll()
    }

    public async login(form: LoginUserDto): Promise<UserWithToken> {
        const user = await this._userRepository.findByEmail(form.email)

        return {
           name : "fahmi",
           email : "fahmi@gmail.com",
           access_token : "1234",
           refresh_token : "1122"
        }
    }
    
    public async register(form: CreateUserDto): Promise<UserData | unknown> {
        const newUser = await this._userRepository.createUser(form)
        return newUser
    }
}