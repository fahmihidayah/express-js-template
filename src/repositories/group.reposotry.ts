import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { PrismaClient, Group } from "@prisma/client";
import { GroupDto } from "../dtos/group";
import { GetResult } from "@prisma/client/runtime/library";
import { Query, Repository } from "./base";
import { PaginateList } from "../dtos";

export interface GroupRepository extends Repository<GroupDto, Group, number>{
}

@injectable()
export class GroupRepositoryImpl implements GroupRepository {

    constructor(@inject(TYPE_PRISMA.PrismaClient) private _prismaClient : PrismaClient) {

    }

    public async update(id : number, form: GroupDto): Promise<Group | null> {
        return await this._prismaClient.group.update({
            where : {
                id : id
            },
            data : form
        })
    }

    public async findById(id: number): Promise<Group | null> {
        return await this._prismaClient.group.findUnique({
            where : {
                id : id
            }
        })
    }
    public async delete(id: number): Promise<Group | null> {
        return await this._prismaClient.group.delete({
            where : {
                id : id
            }
        })
    }

    public async count(): Promise<number> {
        return await this._prismaClient.group.count()
    }
    
    public async create(groupDto: GroupDto): Promise<Group | null> {
        return await this._prismaClient.group.create({
            data : groupDto
        })
    }

    public async findAll(query : Query) : Promise<PaginateList<Array<Group>>> {
        return {
            page : query.page,
            total : await this.count(),
            data : await this._prismaClient.group.findMany({
                where : {
                    name : query.keyword
                }
            })
        }
    }



}