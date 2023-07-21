import { Prisma, PrismaClient, User } from "@prisma/client";
import { CreateUserDto, LoginUserDto, UserData, UserWithToken } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { TYPE_REPOSITORY } from "../repositories";
import { UserRepository } from "../repositories/user.repository";
import { compare, hash } from 'bcrypt';
import { HttpException } from "../exceptions/httpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interfaces";
import { SECRET_KEY } from "../config";
import { sign } from "jsonwebtoken";

export interface UserService {
    login(form: LoginUserDto): Promise<UserWithToken>
    register(form: CreateUserDto): Promise<UserData | unknown>
    findAll(): Promise<UserData[]>
    findById(id: number): Promise<UserData | unknown>
}


@injectable()
export class UserServiceImpl implements UserService {

    constructor(
        @inject(TYPE_REPOSITORY.UserRepository) private _userRepository: UserRepository
    ) {

    }
    public async findById(id: number): Promise<UserData | unknown> {
        return await this._userRepository.findById(id)
    }
    public async findAll(): Promise<UserData[]> {
        const users: UserData[] = (await this._userRepository.findAll())

        return users.map<UserData>((e) => {
            return {
                id: e.id,
                name: e.name,
                email: e.email,
                created_at: e.created_at,
                updated_at: e.updated_at
            }
        })
    }

    public createToken(user: User): TokenData {
        const dataStoredInToken: DataStoredInToken = { id: user.id };
        const secretKey: string | undefined = SECRET_KEY;
        const expiresIn: number = 60 * 60;

        return { expiresIn, token: sign(dataStoredInToken, secretKey ?? "test-1234", { expiresIn }) };
    }

    public async login(form: LoginUserDto): Promise<UserWithToken> {
        const user = await this._userRepository.findByEmail(form.email)
        if (!user) throw new HttpException(409, `This email ${form.email} was not found`);

        const isPasswordMatching: boolean = await compare(form.password, user.password);
        if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

        const tokenData = await this.createToken(user);
        // const cookie = this.createCookie(tokenData);

        return {
            name: user.name,
            email: user.email,
            access_token: tokenData.token,
            refresh_token: "",
            expire_in: tokenData.expiresIn
        }
    }

    public async register(form: CreateUserDto): Promise<UserData | unknown> {
        const hashPassword = await hash(form.password, 10)
        const encryptForm = { ...form, password: hashPassword }
        const newUser = await this._userRepository.create(encryptForm)
        return {
            id: newUser?.id,
            name: newUser?.name,
            email: newUser?.email,
            created_at: newUser?.created_at,
            updated_at: newUser?.updated_at
        }
    }
}