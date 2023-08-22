import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { PrismaClient, Group, AuthPermission, User, Prisma } from "@prisma/client";
import { GroupDto } from "../dtos/group";
import { GetResult } from "@prisma/client/runtime/library";
import { CreateRepository, DeleteRepository, Query, Repository, RetrieveRepository, UpdateRepository } from "./base";
import { PaginateList } from "../dtos";
import { provide } from "inversify-binding-decorators";

export interface GroupRepository extends 
    RetrieveRepository<Group>,
    UpdateRepository<GroupDto, Group, number>,
    CreateRepository<GroupDto, Group>,
    DeleteRepository<Group, number> {
        
    addAuthPermission(groupId : number, authPermission : AuthPermission) : Promise<Group | null>
    removeAuthPermission(groupId : number, authPermissionId : number) : Promise<Group | null>

    addUser(groupId : number, user : User) : Promise<Group | null>
    removeUser(groupId : number, userId : number) : Promise<Group | null>

    countGroupByUser(groupId: number, userId : number) : Promise<number>
}

@provide(GroupRepositoryImpl)
export class GroupRepositoryImpl implements GroupRepository {

    private _group : Prisma.GroupDelegate

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient : PrismaClient) {
        this._group = _prismaClient.group
    }
    
    public async countGroupByUser(groupId: number, userId : number): Promise<number> {
        return await this._group.count({
            where : {
                id : groupId,
                users : {
                    some : {
                        id : userId
                    }
                }
            }
        })
    }
   
   

    public async update(id : number, form: GroupDto): Promise<Group | null> {
        return await this._group.update({
            where : {
                id : id
            },
            data : form
        })
    }

    public async findById(id: number): Promise<Group | null> {
        return await this._group.findUnique({
            where : {
                id : id
            }
        })
    }
    public async delete(id: number): Promise<Group | null> {
        return await this._group.delete({
            where : {
                id : id
            }
        })
    }

    public async count(): Promise<number> {
        return await this._group.count()
    }
    
    public async create(groupDto: GroupDto): Promise<Group | null> {
        return await this._group.create({
            data : groupDto
        })
    }

    public async findAll(query: Query): Promise<Array<Group>> {
        return await this._group.findMany();
    }

    public async countByQuery(query: Query): Promise<number> {
        return await this._group.count({
            where : {
                OR : [
                    {
                        name : {
                            contains : query.keyword
                        }
                    }
                ]
            }
        })
    }

    public async findAllPaginate(query: Query): Promise<PaginateList<Array<Group>>> {
        const { page, take } = query;
        const skip: number = (page - 1) * take;
        const count: number = await this.countByQuery(query)
        const total: number = Math.ceil(count / take)
        const data: Array<Group> = await this._group.findMany({
            skip: skip,
            take: take,
            where: {
                OR: [
                    {
                        name: {

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

    public async addAuthPermission(groupId : number, authPermission : AuthPermission) : Promise<Group | null> {
        return await this._group.update({
            where : {
                id : groupId
            },
            data : {
                auth_permissions : {
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

    public async removeAuthPermission(groupId: number, authPermissionId : number): Promise<Group | null> {
        return await this._group.update({
            where : {
                id : groupId
            },
            data : {
                auth_permissions : {
                    disconnect : {
                        id : authPermissionId
                    }
                }
            }
        })
    }

    public async addUser(groupId: number, user : User): Promise<Group | null> {
        return await this._group.update({
            where : {
                id : groupId
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

    public async removeUser(groupId: number, userId: number): Promise<Group | null> {
        return await this._group.update({
            where : {
                id : groupId
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