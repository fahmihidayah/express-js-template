import 'reflect-metadata';
import { Prisma, PrismaClient, User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto, UpdateUserFormDto, UserData } from "../dtos/user";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";
import { CreateRepository, DeleteRepository, Query, RetrieveRepository, UpdateRepository } from './base';
import { provide } from 'inversify-binding-decorators';

export interface UserRepository extends RetrieveRepository<User>,
    UpdateRepository<UpdateUserFormDto, User, number>,
    CreateRepository<CreateUserDto, User>,
    DeleteRepository<User, number> {

    findByVerifyCode(code: string): Promise<User | null>

    verifyUser(user: User | null): Promise<User | null>

    findByEmail(email: string): Promise<User | null>

}


@provide(UserRepositoryImpl)
export class UserRepositoryImpl implements UserRepository {
    private _user: Prisma.UserDelegate

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient
    ) {
        this._user = _prismaClient.user
    }
    public async delete(id: number): Promise<User | null> {
        return await this._user.delete({
            where: {
                id: id
            }
        }
        );
    }

    public async count(): Promise<number> {
        return await this._user.count();
    }

    public async countByQuery(query: Query): Promise<number> {
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


    async verifyUser(user: User | null): Promise<User | null> {

        return await this._user.update({
            data: {
                is_email_verified: true,
            },
            where: {
                id: (user as User).id
            }
        })
    }
    async findByVerifyCode(code: string): Promise<User | null> {
        return await this._user.findFirst({
            where: {
                email_verification_code: code,
                is_email_verified: false
            }
        })
    }

    async findById(id: number): Promise<User | null> {
        return await this._user.findUnique({
            where: {
                id: id
            }
        })
    }

    async create(user: CreateUserDto): Promise<User | null> {
        return await this._user.create({
            data: user
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this._user.findUnique({
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

        return await this._user.update({
            where: {
                id: id
            },
            data: updatedUserForm
        })
    }

    public async findAllPaginate(query: Query): Promise<PaginateList<User[]>> {
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
            page: page,
            total: total,
            data: data
        };
    }

    public async findAll(query: Query): Promise<Array<User>> {
        return await this._user.findMany({
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
}