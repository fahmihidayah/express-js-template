import 'reflect-metadata';
import { Permission, PrismaClient, User, Prisma } from "@prisma/client";
import { PermissionFormDto, PermissionFormWithRoleDto } from "../dtos/permission";
import { CreateRepository, DeleteRepository, BaseQuery, Repository, RetrieveRepository, UpdateRepository, CountRepository } from "./base";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";
import { provide } from "inversify-binding-decorators";

export interface PermissionRepository extends
    CreateRepository<PermissionFormDto, Permission>,
    RetrieveRepository<Permission>,
    CountRepository<Permission>,
    UpdateRepository<PermissionFormDto, Permission, number>,
    DeleteRepository<Permission, number> {

    addUser(PermissionId: number, user: User): Promise<Permission | null>

    removeUser(PermissionId: number, userId : number): Promise<Permission | null>

    deleteByName(name: string): Promise<boolean>

    countByUser(PermissionId : number, userId : number): Promise<number>

    countNamesByUser(names: Array<string>, userId : number): Promise<number>

    countCodeNamesByUser(names: Array<string>, userId : number): Promise<number>
}

@provide(PermissionRepositoryImpl)
export class PermissionRepositoryImpl implements PermissionRepository {

    private _permission : Prisma.PermissionDelegate

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient) {
        this._permission = _prismaClient.permission

    }
    public async countByUser(PermissionId: number, userId: number): Promise<number> {
        return await this._permission.count({   
            where : {
                id : PermissionId,
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
        const count = await this._permission.count({
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
        return await this._permission.count({
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
        const result = await this._permission.deleteMany({
            where: {
                name: name
            }
        })
        return result.count > 0
    }
    public async addUser(PermissionId: number, user: User): Promise<Permission | null> {
        return await this._permission.update({
            where: {
                id: PermissionId
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
    public async removeUser(PermissionId: number, userId : number): Promise<Permission | null> {
        return await this._permission.update({
            where: {
                id: PermissionId
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

    public async create(form: PermissionFormWithRoleDto): Promise<Permission | null> {
        return await this._permission.create({
            data: {
                name: form.name,
                code_name: form.code_name,
                role : {
                    connectOrCreate : {
                        where : {
                            id : form.role.id
                        },
                        create : form.role
                    }
                }
            }

        })
    }

    public async countByQuery(query: BaseQuery): Promise<number> {
        return await this._permission.count({
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

    public async findAll(query: BaseQuery): Promise<Permission[]> {
        return await this._permission.findMany({
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

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<Permission[]>> {
        const { page, take } = query;
        const skip: number = (page - 1) * take;
        const count: number = await this.countByQuery(query)
        const total: number = Math.ceil(count / take)
        const data: Array<Permission> = await this._permission.findMany({
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
            count: count,
            page: page,
            total: total,
            data: data
        };
    }

    public async update(id: number, form: PermissionFormDto): Promise<Permission | null> {
        return await this._permission.update({
            where: {
                id: id
            },
            data: form
        })
    }

    public async findById(id: number): Promise<Permission | null> {
        return await this._permission.findUnique({
            where: {
                id: id
            }
        })
    }

    public async delete(id: number): Promise<Permission | null> {
        return await this._permission.delete({
            where: {
                id: id
            }
        })
    }

    public async count(): Promise<number> {
        return await this._permission.count();
    }

}