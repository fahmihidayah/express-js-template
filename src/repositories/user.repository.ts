import 'reflect-metadata';
import { Prisma, PrismaClient, User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto, UpdateUserFormDto, UserData, UserNoPassword } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";
import { CreateRepository, DeleteRepository, BaseQuery, RetrieveRepository, UpdateRepository } from './base';
import { provide } from 'inversify-binding-decorators';

export interface UserRepository extends RetrieveRepository<UserData>,
    UpdateRepository<UpdateUserFormDto, UserData, number>,
    CreateRepository<CreateUserDto, UserData>,
    DeleteRepository<UserData, number> {

    findByVerifyCode(code: string): Promise<UserData | null>

    verifyUser(user: User | null): Promise<UserData | null>

    findByEmail(email: string): Promise<UserData | null>

}


@provide(UserRepositoryImpl)
export class UserRepositoryImpl implements UserRepository {
    private _user: Prisma.UserDelegate

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient
    ) {
        this._user = _prismaClient.user
    }
    public async delete(id: number): Promise<UserData | null> {
        const user = await this._user.delete({
            where: {
                id: id
            }
        }
        );
        return new UserData(user)
    }

    public async count(): Promise<number> {
        return await this._user.count();
    }

    public async countByQuery(query: BaseQuery): Promise<number> {
        return await this._user.count({
            where: {
                OR: [
                    {
                        email: {
                            contains: query.keyword
                        }
                    },
                    {
                        first_name: {
                            contains: query.keyword
                        }
                    },
                    {
                        last_name: {
                            contains: query.keyword
                        }
                    }
                ]
            }
        })
    }


    async verifyUser(user: User | null): Promise<UserData | null> {

        const userResult =  await this._user.update({
            data: {
                is_email_verified: true,
            },
            where: {
                id: (user as User).id
            }
        })
        return new UserData(userResult)
    }

    async findByVerifyCode(code: string): Promise<UserData | null> {
        const user = await this._user.findFirst({
            where: {
                email_verification_code: code,
                is_email_verified: false
            }
        })
        if (user === null) return null
        return new UserData(user)
    }

    async findById(id: number): Promise<UserData | null> {
        const user = await this._user.findUnique({
            where: {
                id: id
            }
        })
        if(user === null) return null
        return new UserData(user)
    }

    async create(user: CreateUserDto): Promise<UserData | null> {
        const resultUser = await this._user.create({
            data: user
        })
        if(resultUser === null) return null
        return new UserData(resultUser)

    }

    async findByEmail(email: string): Promise<UserData | null> {
        const user = await this._user.findUnique({
            where: {
                email: email
            }
        })
        if(user === null) return null
        return new UserData(user)
    }

    async update(id: number, userForm: UpdateUserFormDto): Promise<UserData | null> {
        let user = await this.findById(id)
        let updatedUserForm = {
            ...user?.user
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

        const userResult= await this._user.update({
            where: {
                id: id
            },
            data: updatedUserForm
        })
        if(userResult === null) return null
        return new UserData(userResult)
    }

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<UserData[]>> {
        const { page, take } = query;
        const skip: number = (page - 1) * take;
        const count: number = await this.countByQuery(query)
        const total: number = Math.ceil(count / take)
        const data: Array<User> = await this._user.findMany({
            skip: skip,
            take: take,
            where: {
                OR: [
                    {
                        email: {
                            contains: query.keyword
                        }
                    },
                    {
                        first_name: {
                            contains: query.keyword
                        }
                    },
                    {
                        last_name: {

                            contains: query.keyword
                        }
                    }
                ]
            }
        })

        return {
            count : count,
            page: page,
            total: total,
            data: data.map((user) => new UserData(user))
        };
    }

    public async findAll(query: BaseQuery): Promise<Array<UserData>> {
        const users = await this._user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: query.keyword
                        }
                    },
                    {
                        first_name: {
                            contains: query.keyword
                        }
                    },
                    {
                        last_name: {

                            contains: query.keyword
                        }
                    }
                ]
            }
        })
        return users.map((user) => new UserData(user))
    }
}