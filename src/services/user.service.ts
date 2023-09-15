import 'reflect-metadata';
import { Prisma, PrismaClient, User, UserToken } from "@prisma/client";
import { CreateUserDto, LoginUserDto, RefreshToken, RefreshTokenDto, UserData, UserNoPassword, UserWithToken } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { UserRepository, UserRepositoryImpl } from "../repositories/user.repository";
import { compare, hash } from 'bcrypt';
import { HttpException } from "../exceptions/httpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interfaces";
import { SECRET_KEY } from "../config";
import { sign } from "jsonwebtoken";
import { createToken, renewToken, userToUserData} from "../utils/authentication.utils";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";
import { createRandomNumber } from "../utils/string.utils";
import { UserTokenRepository, UserTokenRepositoryImpl } from "../repositories/userToken.repository";
import { BaseQuery } from '../repositories/base';
import { provide } from 'inversify-binding-decorators';

export interface UserService {
    verify(code: string): Promise<UserNoPassword | null>
    login(form: LoginUserDto): Promise<UserWithToken>
    logout(userData : UserData): Promise<boolean>
    register(form: CreateUserDto): Promise<UserNoPassword | null>
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<string | null>

    findAllPaginate(query: BaseQuery): Promise<PaginateList<UserNoPassword[]>>
    findById(id: number): Promise<UserData | null>
}

@provide(UserServiceImpl)
export class UserServiceImpl implements UserService {

    private _userRepository: UserRepository
    private _userTokenRepository: UserTokenRepository

    constructor(
        userRepositoryImpl: UserRepositoryImpl,
        userTokenRepositoryImpl: UserTokenRepositoryImpl
    ) {
        this._userRepository = userRepositoryImpl
        this._userTokenRepository = userTokenRepositoryImpl
    }

    public async logout(userData: UserData): Promise<boolean> {
        return await this._userTokenRepository.deleteByUser(userData.user);
    }

    public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<string | null> {
        const userToken = await this._userTokenRepository.findByToken(refreshTokenDto.refresh_token)
        if (userToken !== null) {
            return renewToken(userToken?.id)
        }
        else {
            return null
        }
    }

    public async verify(code: string): Promise<UserNoPassword | null> {
        const user: UserData | null = await this._userRepository.findByVerifyCode(code);
        if (user !== null) {
            const updateUser = await this._userRepository.verifyUser(user.user)
            if(updateUser === null) return null
            return updateUser?.toUserNoPassword()
        }
        else {
            return null
        }
    }

    public async findById(id: number): Promise<UserData | null> {
        const user = await this._userRepository.findById(id)
        return user
    }

    public async findAllPaginate(usersQuery: BaseQuery): Promise<PaginateList<UserNoPassword[]>> {
        const users = await this._userRepository.findAllPaginate(usersQuery)
        return {
            page: users.page,
            total: users.total,
            count : users.count,
            data: users.data.map(user => user.toUserNoPassword())
        }
    }

    public async login(form: LoginUserDto): Promise<UserWithToken> {
        const user : UserData | null = await this._userRepository.findByEmail(form.email)
        if (!user) throw new HttpException(409, `This email ${form.email} was not found`);

        const isPasswordMatching: boolean = await compare(form.password, user.user.password);
        if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

        const tokenData = await createToken(user.user);
        // const cookie = this.createCookie(tokenData);
        const userToken = await this._userTokenRepository.findByUser(user.user);
        if (userToken === null) {
            await this._userTokenRepository.createToken(user.user, tokenData.refresh_token);
        }
        else {
            await this._userTokenRepository.updateToken(user.user, tokenData.refresh_token);
        }
        return user.toUserWithToken(tokenData);
    }

    public async register(form: CreateUserDto): Promise<UserNoPassword | null> {
        const hashPassword = await hash(form.password, 10)
        const encryptForm = { ...form, password: hashPassword, email_verification_code: createRandomNumber() }
        const newUser = await this._userRepository.create(encryptForm)
        if(newUser === null) return null
        return newUser?.toUserNoPassword()
    }


}