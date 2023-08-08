import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto, UpdateUserFormDto, UserData } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { UsersQuery } from ".";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";

export interface UserRepository {

    findByVerifyCode(code: string): Promise<User | null>

    verifyUser(user: User | null): Promise<User | null>

    create(user: CreateUserDto): Promise<User | null>

    findByEmail(email: string): Promise<User | null>

    findById(id: number): Promise<User | null>

    update(id: number, userForm: UpdateUserFormDto): Promise<User | null>

    findAll(usersQuery: UsersQuery): Promise<PaginateList<User[]>>

    count(): Promise<number>
}


@injectable()
export class UserRepositoryImpl implements UserRepository {

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient
    ) {

    }
    async count(): Promise<number> {
        return await this._prismaClient.user.count();
    }


    async verifyUser(user: User | null): Promise<User | null> {

        return await this._prismaClient.user.update({
            data: {
                is_email_verified: true,
            },
            where: {
                id: (user as User).id
            }
        })
    }
    async findByVerifyCode(code: string): Promise<User | null> {
        return await this._prismaClient.user.findFirst({
            where: {
                email_verification_code: code,
                is_email_verified: false
            }
        })
    }

    async findById(id: number): Promise<User | null> {
        return await this._prismaClient.user.findUnique({
            where: {
                id: id
            }
        })
    }

    async create(user: CreateUserDto): Promise<User | null> {
        return await this._prismaClient.user.create({
            data: user
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this._prismaClient.user.findUnique({
            where: {
                email: email
            }
        })
    }

    async update(id: number, userForm: UpdateUserFormDto): Promise<User | null> {
        let user = await this.findById(id)
        let updatedUserForm = {
            ...user
        }

        if (userForm.email) {
            updatedUserForm.email = userForm.email
        }

        if (userForm.first_name) {
            updatedUserForm.first_name = userForm.first_name
        }

        if (userForm.last_name) {
            updatedUserForm.last_name = userForm.last_name
        }

        if (userForm.password) {
            updatedUserForm.password = userForm.password
        }

        return await this._prismaClient.user.update({
            where: {
                id: id
            },
            data: updatedUserForm
        })
    }

    async findAll(usersQuery: UsersQuery = { page: 1, take: 10, keyword: "" }): Promise<PaginateList<User[]>> {
        const { page, take } = usersQuery;
        const skip: number = (page - 1) * take;
        const count: number = await this.count();
        const total: number = Math.ceil(count / take)
        const data: Array<User> = await this._prismaClient.user.findMany({
            skip: skip,
            take: take,
            where: {
                OR: [
                    {
                        email: {
                            contains: usersQuery.keyword
                        }
                    },
                    {
                        first_name: {
                            contains: usersQuery.keyword
                        }
                    },
                    {
                        last_name: {
                            contains: usersQuery.keyword
                        }
                    }
                ]
            }
        })

        return {
            page: page,
            total: total,
            data: data
        };
    }

}