import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { PrismaClient, Role } from "@prisma/client";
import { RoleDto } from "../dtos/role";
import { GetResult } from "@prisma/client/runtime/library";

export interface RoleRepository {

    findAll(): Promise<Role[]>
    create(roleDto: RoleDto): Promise<Role | null>
    findById(id: number): Promise<Role | null>
    delete(id: number): Promise<Role | null>

}

@injectable()
export class RoleRepositoryImpl implements RoleRepository {

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient) { }
    
    public async delete(id: number): Promise<Role | null> {
        return await this._prismaClient.role.delete({
            where: {
                id: id
            }
        })
    }

    public async findAll(): Promise<Role[]> {
        return await this._prismaClient.role.findMany();
    }

    public async create(roleDto: RoleDto): Promise<Role | null> {
        return await this._prismaClient.role.create({
            data: roleDto
        })
    }

    public async findById(id: number): Promise<Role | null> {
        return await this._prismaClient.role.findFirst({
            where: {
                id: id
            }
        })
    }


}