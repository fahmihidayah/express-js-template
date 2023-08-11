import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { GetResult } from "@prisma/client/runtime/library";
import { TYPE_REPOSITORY } from "../repositories";
import { GroupRepository } from '../repositories/group.reposotry';
import { GroupDto } from '../dtos/group';
import { Query } from '../repositories/base';
import { AuthPermission, Group, User } from '@prisma/client';
import { PaginateList } from '../dtos';
import { UserRepository } from '../repositories/user.repository';
import { AuthPermissionRepository } from '../repositories/authPermission.repository';

export interface GroupService {
    create(groupDto : GroupDto) : Promise<Group | null>

    findAll(query : Query) : Promise<PaginateList<Array<Group>>>

    delete(id : number) : Promise<Group | null>

    findById(id : number) : Promise<Group | null>

    addAuthPermission(groupId : number, authPermissionId : number) : Promise<Group | null>

    removeAuthPermission(groupId : number, authPermissionId : number) : Promise<Group | null>

    addUser(groupId : number, userId : number) : Promise<Group | null>

    removeUser(groupId : number, userId : number) : Promise<Group | null>

    isUserInGroupName(user : User, groupName : string) : Promise<boolean>
}

@injectable()
export class GroupServiceImpl implements GroupService {

    constructor(
        @inject(TYPE_REPOSITORY.GroupRepository) private _groupRepository : GroupRepository,
        @inject(TYPE_REPOSITORY.UserRepository) private _userRepository : UserRepository,
        @inject(TYPE_REPOSITORY.AuthPermissionRepository) private _authPermissionRepository : AuthPermissionRepository) {
    }
    
    public async isUserInGroupName(user: User, groupName: string): Promise<boolean> {
        return false
    }

    public async addUser(groupId: number, userId: number): Promise<Group | null> {
        const user = await this._userRepository.findById(userId) as User
        return await this._groupRepository.addUser(groupId, user);
    }

    public async removeUser(groupId: number, userId: number): Promise<Group | null> {
        return await this._groupRepository.removeUser(groupId, userId);
    }

    public async removeAuthPermission(groupId: number, authPermissionId: number): Promise<Group | null> {
        return await this._groupRepository.removeAuthPermission(groupId, authPermissionId)
    }
    public async addAuthPermission(groupId: number, authPermissionId: number): Promise<Group | null> {
        const authPermission = await this._authPermissionRepository.findById(authPermissionId) as AuthPermission;
        return await this._groupRepository.addAuthPermission(groupId, authPermission)
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