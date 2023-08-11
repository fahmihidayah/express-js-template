import { AuthPermission, PrismaClient, User } from "@prisma/client";
import { AuthPermissionDto } from "../dtos/auth.permission";
import { Query, Repository } from "./base";
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";

export interface AuthPermissionRepository extends Repository<AuthPermissionDto, AuthPermission, number> {
    addUser(authPermissionId: number, user: User): Promise<AuthPermission | null>
    removeUser(authPermissionId: number, user: User): Promise<AuthPermission | null>
    deleteByName(name : string) : Promise<boolean>
}

@injectable()
export class AuthPermissionRepositoryImpl implements AuthPermissionRepository {

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient) {

    }
    public async deleteByName(name: string): Promise<boolean> {
        const result = await this._prismaClient.authPermission.deleteMany({
            where : {
                name : name
            }
        })
        return result.count > 0
    }
    public async addUser(authPermissionId: number, user: User): Promise<AuthPermission | null> {
        return await this._prismaClient.authPermission.update({
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
    public async removeUser(authPermissionId: number, user: User): Promise<AuthPermission | null> {
        return await this._prismaClient.authPermission.update({
            where: {
                id: authPermissionId
            },
            data: {
                users: {
                    disconnect: {
                        id: user.id
                    }
                }
            }
        })
    }


    public async findAll(query: Query): Promise<PaginateList<AuthPermission[]>> {
        return {
            page: query.page,
            total: await this.count(),
            data: await this._prismaClient.authPermission.findMany({
                where: {
                    OR: [
                        {
                            name: { contains: query.keyword }
                        },
                        {
                            code_name: { contains: query.keyword }
                        }
                    ]
                }
            })
        }
    }

    public async create(form: AuthPermissionDto): Promise<AuthPermission | null> {
        return await this._prismaClient.authPermission.create({
            data: form
        })
    }

    public async update(id: number, form: AuthPermissionDto): Promise<AuthPermission | null> {
        return await this._prismaClient.authPermission.update({
            where: {
                id: id
            },
            data: form
        })
    }

    public async findById(id: number): Promise<AuthPermission | null> {
        return await this._prismaClient.authPermission.findUnique({
            where: {
                id: id
            }
        })
    }

    public async delete(id: number): Promise<AuthPermission | null> {
        return await this._prismaClient.authPermission.delete({
            where: {
                id: id
            }
        })
    }

    public async count(): Promise<number> {
        return await this._prismaClient.authPermission.count();
    }

}