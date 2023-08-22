import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { GetResult } from "@prisma/client/runtime/library";
import { GroupRepository, GroupRepositoryImpl } from '../repositories/group.repository';
import { GroupDto } from '../dtos/group';
import { Query } from '../repositories/base';
import { AuthPermission, Group, User } from '@prisma/client';
import { PaginateList } from '../dtos';
import { UserRepository, UserRepositoryImpl } from '../repositories/user.repository';
import { AuthPermissionRepository, AuthPermissionRepositoryImpl } from '../repositories/authPermission.repository';
import { provide } from 'inversify-binding-decorators';

export interface GroupService {
    create(groupDto : GroupDto) : Promise<Group | null>

    findAllPaginate(query : Query) : Promise<PaginateList<Array<Group>>>

    delete(id : number) : Promise<Group | null>

    findById(id : number) : Promise<Group | null>

    addAuthPermission(groupId : number, authPermissionId : number) : Promise<Group | null>

    removeAuthPermission(groupId : number, authPermissionId : number) : Promise<Group | null>

    addUser(groupId : number, userId : number) : Promise<Group | null>

    removeUser(groupId : number, userId : number) : Promise<Group | null>

    isUserInGroupName(user: User, groupId : number) : Promise<boolean>
}

@provide(GroupServiceImpl)
export class GroupServiceImpl implements GroupService {

    private _groupRepository : GroupRepository
    private _userRepository : UserRepository
    private _authPermissionRepository : AuthPermissionRepository

    constructor(
        groupRepository : GroupRepositoryImpl,
        userRepository : UserRepositoryImpl,
        authPermissionRepository : AuthPermissionRepositoryImpl) 
        {
            this._authPermissionRepository = authPermissionRepository
            this._groupRepository = groupRepository
            this._userRepository = userRepository
    }
    
    public async isUserInGroupName(user: User, groupId : number): Promise<boolean> {
        const countGroup = await this._groupRepository.countGroupByUser(groupId, user.id);
        return countGroup >= 1;
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

    public async findAllPaginate(query: Query): Promise<PaginateList<Array<Group>>> {
        return await this._groupRepository.findAllPaginate(query)
    }

    public async delete(id: number): Promise<Group | null> {
        return await this._groupRepository.delete(id)
    }

}