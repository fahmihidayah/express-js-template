import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { GetResult } from "@prisma/client/runtime/library";
import { RoleRepository, RoleRepositoryImpl } from '../repositories/role.repository';
import { RoleFormDto } from '../dtos/role';
import { BaseQuery } from '../repositories/base';
import { Permission, Role, User } from '@prisma/client';
import { PaginateList } from '../dtos';
import { UserRepository, UserRepositoryImpl } from '../repositories/user.repository';
import { PermissionRepository, PermissionRepositoryImpl } from '../repositories/permission.repository';
import { provide } from 'inversify-binding-decorators';

export interface RoleService {
    create(RoleDto : RoleFormDto) : Promise<Role | null>

    findAllPaginate(query : BaseQuery) : Promise<PaginateList<Array<Role>>>

    delete(id : number) : Promise<Role | null>

    findById(id : number) : Promise<Role | null>

    addAuthPermission(RoleId : number, authPermissionId : number) : Promise<Role | null>

    removeAuthPermission(RoleId : number, authPermissionId : number) : Promise<Role | null>

    addUser(RoleId : number, userId : number) : Promise<Role | null>

    removeUser(RoleId : number, userId : number) : Promise<Role | null>

    isUserInRoleName(user: User, RoleId : number) : Promise<boolean>
}

@provide(RoleServiceImpl)
export class RoleServiceImpl implements RoleService {

    private _RoleRepository : RoleRepository
    private _userRepository : UserRepository
    private _permissionRepository : PermissionRepository

    constructor(
        RoleRepository : RoleRepositoryImpl,
        userRepository : UserRepositoryImpl,
        authPermissionRepository : PermissionRepositoryImpl) 
        {
            this._permissionRepository = authPermissionRepository
            this._RoleRepository = RoleRepository
            this._userRepository = userRepository
    }
    
    public async isUserInRoleName(user: User, RoleId : number): Promise<boolean> {
        const countRole = await this._RoleRepository.countRoleByUser(RoleId, user.id);
        return countRole >= 1;
    }

    public async addUser(RoleId: number, userId: number): Promise<Role | null> {
        const user = await this._userRepository.findById(userId)
        if(user === null) return null
        return await this._RoleRepository.addUser(RoleId, user.user);
    }

    public async removeUser(RoleId: number, userId: number): Promise<Role | null> {
        return await this._RoleRepository.removeUser(RoleId, userId);
    }

    public async removeAuthPermission(RoleId: number, authPermissionId: number): Promise<Role | null> {
        return await this._RoleRepository.removeAuthPermission(RoleId, authPermissionId)
    }
    public async addAuthPermission(RoleId: number, authPermissionId: number): Promise<Role | null> {
        const authPermission = await this._permissionRepository.findById(authPermissionId)
        if(authPermission === null) return null
        return await this._RoleRepository.addAuthPermission(RoleId, authPermission)
    }

    public async findById(id: number): Promise<Role | null> {
        return await this._RoleRepository.findById(id)
    }
    
    public async create(RoleDto: RoleFormDto): Promise<Role | null> {
        return await this._RoleRepository.create(RoleDto)
    }

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<Array<Role>>> {
        return await this._RoleRepository.findAllPaginate(query)
    }

    public async delete(id: number): Promise<Role | null> {
        return await this._RoleRepository.delete(id)
    }

}