import 'reflect-metadata';
import { AuthPermission, PrismaClient, User, Prisma } from "@prisma/client";
import { AuthPermissionDto } from "../dtos/auth.permission";
import { CreateRepository, DeleteRepository, Query, Repository, RetrieveRepository, UpdateRepository } from "./base";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";
import { provide } from "inversify-binding-decorators";

export interface AuthPermissionRepository extends
    CreateRepository<AuthPermissionDto, AuthPermission>,
    RetrieveRepository<AuthPermission>,
    UpdateRepository<AuthPermissionDto, AuthPermission, number>,
    DeleteRepository<AuthPermission, number> {

    addUser(authPermissionId: number, user: User): Promise<AuthPermission | null>

    removeUser(authPermissionId: number, userId : number): Promise<AuthPermission | null>

    deleteByName(name: string): Promise<boolean>

    countByUser(authPermissionId : number, userId : number): Promise<number>

    countNamesByUser(names: Array<string>, userId : number): Promise<number>

    countCodeNamesByUser(names: Array<string>, userId : number): Promise<number>
}

@provide(AuthPermissionRepositoryImpl)
export class AuthPermissionRepositoryImpl implements AuthPermissionRepository {

    private _authPermission : Prisma.AuthPermissionDelegate

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient) {
        this._authPermission = _prismaClient.authPermission

    }
    public async countByUser(authPermissionId: number, userId: number): Promise<number> {
        return await this._authPermission.count({   
            where : {
                id : authPermissionId,
                users : {
                    some : {
                        id : userId
                    }
                }
            }
        })
    }
    
    public async countCodeNamesByUser(names: string[], userId : number): Promise<number> {
        const codeNamesQuery = names.map(e => { return { code_name: e } })
        const count = await this._authPermission.count({
            where: {
                OR: [
                    ...codeNamesQuery
                ],
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        })
        return count;
    }

    public async countNamesByUser(names: string[], userId : number ): Promise<number> {
        const namesQuery = names.map(e => { return { name: e } })
        return await this._authPermission.count({
            where: {
                OR: [
                    ...namesQuery
                ],
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        })
    }

    public async deleteByName(name: string): Promise<boolean> {
        const result = await this._authPermission.deleteMany({
            where: {
                name: name
            }
        })
        return result.count > 0
    }
    public async addUser(authPermissionId: number, user: User): Promise<AuthPermission | null> {
        return await this._authPermission.update({
            where: {
                id: authPermissionId
            },
            data: {
                users: {
                    connectOrCreate: [
                        {
                            where: {
                                id: user.id
                            },
                            create: user
                        }
                    ]
                }
            }
        })
    }
    public async removeUser(authPermissionId: number, userId : number): Promise<AuthPermission | null> {
        return await this._authPermission.update({
            where: {
                id: authPermissionId
            },
            data: {
                users: {
                    disconnect: {
                        id: userId
                    }
                }
            }
        })
    }

    public async create(form: AuthPermissionDto): Promise<AuthPermission | null> {
        return await this._authPermission.create({
            data: form
        })
    }

    public async countByQuery(query: Query): Promise<number> {
        return await this._authPermission.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: query.keyword
                        },
                    },
                    {
                        code_name: {
                            contains: query.keyword
                        }
                    }
                ]
            }
        })
    }

    public async findAll(query: Query): Promise<AuthPermission[]> {
        return await this._authPermission.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query.keyword
                        }
                    },
                    {
                        code_name: {
                            contains: query.keyword
                        }
                    }
                ]
            }
        })
    }

    public async findAllPaginate(query: Query): Promise<PaginateList<AuthPermission[]>> {
        const { page, take } = query;
        const skip: number = (page - 1) * take;
        const count: number = await this.countByQuery(query)
        const total: number = Math.ceil(count / take)
        const data: Array<AuthPermission> = await this._authPermission.findMany({
            skip: skip,
            take: take,
            where: {
                OR: [
                    {
                        name: {
                            contains: query.keyword
                        }
                    },
                    {
                        code_name: {
                            contains: query.keyword
                        }
                    },
                ]
            }
        })

        return {
            page: page,
            total: total,
            data: data
        };
    }

    public async update(id: number, form: AuthPermissionDto): Promise<AuthPermission | null> {
        return await this._authPermission.update({
            where: {
                id: id
            },
            data: form
        })
    }

    public async findById(id: number): Promise<AuthPermission | null> {
        return await this._authPermission.findUnique({
            where: {
                id: id
            }
        })
    }

    public async delete(id: number): Promise<AuthPermission | null> {
        return await this._authPermission.delete({
            where: {
                id: id
            }
        })
    }

    public async count(): Promise<number> {
        return await this._authPermission.count();
    }

}