import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { GetResult } from "@prisma/client/runtime/library";
import { TYPE_REPOSITORY } from "../repositories";
import { GroupRepository } from '../repositories/group.reposotry';
import { GroupDto } from '../dtos/group';
import { Query } from '../repositories/base';
import { Group } from '@prisma/client';
import { PaginateList } from '../dtos';

export interface GroupService {
    create(groupDto : GroupDto) : Promise<Group | null>
    findAll(query : Query) : Promise<PaginateList<Array<Group>>>
    delete(id : number) : Promise<Group | null>
    findById(id : number) : Promise<Group | null>
}

@injectable()
export class GroupServiceImpl implements GroupService {

    constructor(@inject(TYPE_REPOSITORY.GroupRepository) private _groupRepository : GroupRepository) {

    }

    public async findById(id: number): Promise<Group | null> {
        return await this._groupRepository.findById(id)
    }
    
    public async create(groupDto: GroupDto): Promise<Group | null> {
        return await this._groupRepository.create(groupDto)
    }

    public async findAll(query: Query): Promise<PaginateList<Array<Group>>> {
        return await this._groupRepository.findAll(query)
    }

    public async delete(id: number): Promise<Group | null> {
        return await this._groupRepository.delete(id)
    }

}