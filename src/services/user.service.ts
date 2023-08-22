import 'reflect-metadata';
import { Prisma, PrismaClient, User, UserToken } from "@prisma/client";
import { CreateUserDto, LoginUserDto, RefreshToken, RefreshTokenDto, UserData, UserWithToken } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { UserRepository, UserRepositoryImpl } from "../repositories/user.repository";
import { compare, hash } from 'bcrypt';
import { HttpException } from "../exceptions/httpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interfaces";
import { SECRET_KEY } from "../config";
import { sign } from "jsonwebtoken";
import { createToken, renewToken, userToUserData, userToUserWithToken } from "../utils/authentication.utils";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";
import { createRandomNumber } from "../utils/string.utils";
import { UserTokenRepository, UserTokenRepositoryImpl } from "../repositories/userToken.repository";
import { Query } from '../repositories/base';
import { provide } from 'inversify-binding-decorators';

export interface UserService {
    verify(code : string) : Promise<UserData | unknown>
    login(form: LoginUserDto): Promise<UserWithToken>
    register(form: CreateUserDto): Promise<UserData | unknown>
    findAllPaginate(query : Query): Promise<PaginateList<UserData[]>>
    findById(id: number): Promise<UserData | unknown>
    refreshToken(refreshTokenDto : RefreshTokenDto) : Promise<string | null>
}

@provide(UserServiceImpl)
export class UserServiceImpl implements UserService {

    private _userRepository : UserRepository
    private _userTokenRepository : UserTokenRepository

    constructor(
        userRepositoryImpl : UserRepositoryImpl,
        userTokenRepositoryImpl : UserTokenRepositoryImpl
    ) {
        this._userRepository = userRepositoryImpl
        this._userTokenRepository = userTokenRepositoryImpl
    }

    public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<string | null> {
        const userToken = await this._userTokenRepository.findByToken(refreshTokenDto.refreshToken) 
        if(userToken !== null) {
            return renewToken(userToken?.id)
        }
        else {
            return null
        }
    }

    public async verify(code: string): Promise<User| unknown> {
       const user : User | null = await this._userRepository.findByVerifyCode(code);
       if(user !== null) {
            const updateUser = await this._userRepository.verifyUser(user)
            return userToUserData(updateUser as User);
       }
    }

    public async findById(id: number): Promise<UserData | unknown> {
        return await this._userRepository.findById(id)
    }
    public async findAllPaginate(usersQuery : Query = {page : 1, take : 10, keyword : "", orderBy : "id", orderByDirection : "asc"}): Promise<PaginateList<UserData[]>> {
        const users = await this._userRepository.findAllPaginate(usersQuery)
        return {
            page : users.page,
            total : users.total,
            data : users.data.map<UserData>((user)=> {return userToUserData(user as User)})
        }
    }

    public async login(form: LoginUserDto): Promise<UserWithToken> {
        const user = await this._userRepository.findByEmail(form.email)
        if (!user) throw new HttpException(409, `This email ${form.email} was not found`);

        const isPasswordMatching: boolean = await compare(form.password, user.password);
        if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

        const tokenData = await createToken(user);
        // const cookie = this.createCookie(tokenData);
        const userToken = await this._userTokenRepository.findByUser(user);
        if(userToken === null) {
            await this._userTokenRepository.createToken(user, tokenData.refresh_token);
        }
        else {
            await this._userTokenRepository.updateToken(user, tokenData.refresh_token);
        }
        return userToUserWithToken(user, tokenData);
    }

    public async register(form: CreateUserDto): Promise<UserData | unknown> {
        const hashPassword = await hash(form.password, 10)
        const encryptForm = { ...form, password: hashPassword, email_verification_code : createRandomNumber() }
        const newUser = await this._userRepository.create(encryptForm)
        return userToUserData(newUser as User)
    }


}