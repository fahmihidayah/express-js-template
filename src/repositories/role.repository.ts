import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { PrismaClient, Role, Permission, User, Prisma } from "@prisma/client";
import { RoleFormDto } from "../dtos/role";
import { GetResult } from "@prisma/client/runtime/library";
import { CreateRepository, DeleteRepository, BaseQuery, Repository, RetrieveRepository, UpdateRepository, CountRepository } from "./base";
import { PaginateList } from "../dtos";
import { provide } from "inversify-binding-decorators";

export interface RoleRepository extends 
    RetrieveRepository<Role>,
    UpdateRepository<RoleFormDto, Role, number>,
    CountRepository<Role>,
    CreateRepository<RoleFormDto, Role>,
    DeleteRepository<Role, number> {
        
    createDefaultRole() : Promise<Role | null>
    addAuthPermission(RoleId : number, authPermission : Permission) : Promise<Role | null>
    removeAuthPermission(RoleId : number, authPermissionId : number) : Promise<Role | null>

    addUser(RoleId : number, user : User) : Promise<Role | null>
    removeUser(RoleId : number, userId : number) : Promise<Role | null>

    countRoleByUser(RoleId: number, userId : number) : Promise<number>
}

@provide(RoleRepositoryImpl)
export class RoleRepositoryImpl implements RoleRepository {

    private _role : Prisma.RoleDelegate

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient : PrismaClient) {
        this._role = _prismaClient.role
    }

    private createWhereInput(query : BaseQuery) : Prisma.RoleWhereInput | undefined {
        const whereInputs : Prisma.RoleWhereInput[] = []

        query.extraQueries.forEach((value, key) => {
            whereInputs.push({
                [String(key)] : {
                    contains : value
                }
            })
        })
        const whereInput : Prisma.RoleWhereInput | undefined = whereInputs.length > 0 ? {
            OR : whereInputs} : undefined
        return whereInput
    }

    public async createDefaultRole(): Promise<Role | null> {
        const defaultRole = await this._role.findFirst({
            where : {
                name : "USER"
            }
        })
        if(defaultRole !== null) {
            return defaultRole
        }
        const role = await this._role.create({
            data : {
                name : "USER",
            }
        })
        return role
    }


    
    public async countRoleByUser(RoleId: number, userId : number): Promise<number> {
        return await this._role.count({
            where : {
                id : RoleId,
                users : {
                    some : {
                        id : userId
                    }
                }
            }
        })
    }
   
   

    public async update(id : number, form: RoleFormDto): Promise<Role | null> {
        return await this._role.update({
            where : {
                id : id
            },
            data : form
        })
    }

    public async findById(id: number): Promise<Role | null> {
        return await this._role.findUnique({
            where : {
                id : id
            }
        })
    }
    public async delete(id: number): Promise<Role | null> {
        return await this._role.delete({
            where : {
                id : id
            }
        })
    }

    public async count(): Promise<number> {
        return await this._role.count()
    }
    
    public async create(RoleDto: RoleFormDto): Promise<Role | null> {
        return await this._role.create({
            data : RoleDto
        })
    }

    public async findAll(query: BaseQuery): Promise<Array<Role>> {
        return await this._role.findMany();
    }

    public async countByQuery(query: BaseQuery): Promise<number> {
        return await this._role.count({
            where : this.createWhereInput(query)
        })
    }

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<Array<Role>>> {
        const { page, take } = query;
        const skip: number = (page - 1) * take;
        const count: number = await this.countByQuery(query)
        const total: number = Math.ceil(count / take)
        const data: Array<Role> = await this._role.findMany({
            skip: skip,
            take: take,
            where: this.createWhereInput(query),
        })
        return {
            page: page,
            total: total,
            data: data,
            count : count
        };
    }

    public async addAuthPermission(RoleId : number, authPermission : Permission) : Promise<Role | null> {
        return await this._role.update({
            where : {
                id : RoleId
            },
            data : {
                permissions : {
                    connectOrCreate : {
                        where : {
                            id : authPermission.id
                        },
                        create : authPermission
                    }
                }
            }
        })
    }

    public async removeAuthPermission(RoleId: number, authPermissionId : number): Promise<Role | null> {
        return await this._role.update({
            where : {
                id : RoleId
            },
            data : {
                permissions : {
                    disconnect : {
                        id : authPermissionId
                    }
                }
            }
        })
    }

    public async addUser(RoleId: number, user : User): Promise<Role | null> {
        return await this._role.update({
            where : {
                id : RoleId
            },
            data : {
                users : {
                    connectOrCreate : {
                        where : {
                            id : user.id
                        },
                        create : user
                    }
                }
            }
        })
    }

    public async removeUser(RoleId: number, userId: number): Promise<Role | null> {
        return await this._role.update({
            where : {
                id : RoleId
            },
            data : {
                users : {
                    disconnect : {
                        id : userId
                    }
                }
            }
        })
    }
}