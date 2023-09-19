import 'reflect-metadata';
import { Permission, PrismaClient, User, Prisma } from "@prisma/client";
import { PermissionFormDto, PermissionFormWithRoleDto } from "../dtos/permission";
import { CreateRepository, DeleteRepository, BaseQuery, Repository, RetrieveRepository, UpdateRepository, CountRepository, QueryAction, createQueryAction } from "./base";
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

    private createWhereInput(query: BaseQuery): Prisma.PermissionWhereInput | undefined {
        const whereInputs: Prisma.PermissionWhereInput[] = []

        query.extraQueries.forEach((value, key) => {
            whereInputs.push({
                [String(key)]: {
                    contains: value
                }
            })
        })
        const whereInput: Prisma.PermissionWhereInput | undefined = whereInputs.length > 0 ? {
            OR: whereInputs
        } : undefined
        return whereInput
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
            where: this.createWhereInput(query)
        })
    }

    public async findAll(query: BaseQuery): Promise<Permission[]> {
        return await this._permission.findMany({
            where: this.createWhereInput(query)
        })
    }

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<Permission[]>> {
        const queryAction : QueryAction = await createQueryAction(query, this)

        const data: Array<Permission> = await this._permission.findMany({
            skip: queryAction.skip,
            take: queryAction.take,
            where: this.createWhereInput(query)
        })

        return {
            count: queryAction.count,
            page: query.page,
            total: queryAction.total,
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