import { Permission, Role, User } from "@prisma/client"
import { PermissionFormDto, AuthPermissionNameDto } from "../dtos/permission"
import { BaseQuery } from "../repositories/base"
import { PaginateList } from "../dtos"
import { inject, injectable } from "inversify"
import { PermissionRepository, PermissionRepositoryImpl } from "../repositories/permission.repository"
import { GetResult } from "@prisma/client/runtime/library"
import { UserRepository, UserRepositoryImpl } from "../repositories/user.repository"
import { provide } from "inversify-binding-decorators"
import { RoleRepositoryImpl } from "../repositories/role.repository"

export interface PermissionService {

    createFromName(form: AuthPermissionNameDto): Promise<Array<Permission>>

    deleteByName(name: string): Promise<boolean>

    create(form: PermissionFormDto): Promise<Permission | null>

    findAllPaginate(query: BaseQuery): Promise<PaginateList<Array<Permission>>>

    update(id: number, form: PermissionFormDto): Promise<Permission | null>

    delete(id: number): Promise<Permission | null>

    findById(id: number): Promise<Permission | null>

    addUser(PermissionId: number, userId: number): Promise<Permission | null>

    removeUser(PermissionId: number, userId: number): Promise<Permission | null>

    isUserHasPermissionName(user: User, name: Array<string>): Promise<boolean>

    isUserHasPermissionCodeName(user: User, codeName: Array<string>): Promise<boolean>


}

@provide(PermissionServiceImpl)
export class PermissionServiceImpl implements PermissionService {

    constructor(
        
        private _permissionRepository: PermissionRepositoryImpl,
        private _userRepository: UserRepositoryImpl,
        private _roleRepository : RoleRepositoryImpl
    ) {
    }

    public async isUserHasPermissionName(user: User, name: string[]): Promise<boolean> {
        const count = await this._permissionRepository.countNamesByUser(name, user.id);
        return count >= 1;
    }

    public async isUserHasPermissionCodeName(user: User, codeName: string[]): Promise<boolean> {
        const count = await this._permissionRepository.countCodeNamesByUser(codeName, user.id);
        return count >= 1;
    }

    public async deleteByName(name: string): Promise<boolean> {
        return await this._permissionRepository.deleteByName(name)
    }


    public async createFromName(form: AuthPermissionNameDto): Promise<Permission[]> {
        const codeNames = ["create", "read", "update", "delete"];
        const defaultRole = await this._roleRepository.createDefaultRole();
        let listPermissions: Array<Permission> = [];
        for (let codeName of codeNames) {
            const Permission = await this._permissionRepository.create({
                name: form.name,
                code_name: `${form.name}_${codeName}`,
                role: defaultRole as Role
            })
            listPermissions.push(Permission!)
        }
        return listPermissions;
    }

    public async update(id: number, form: PermissionFormDto): Promise<Permission | null> {
        return await this._permissionRepository.update(id, form)
    }

    public async addUser(PermissionId: number, userId: number): Promise<Permission | null> {
        const user = await this._userRepository.findById(userId)
        if (!user) {
            return null;
        }
        return await this._permissionRepository.addUser(PermissionId, user?.user);
    }

    public async removeUser(PermissionId: number, userId: number): Promise<Permission | null> {
        return await this._permissionRepository.removeUser(PermissionId, userId)
    }

    public async create(form: PermissionFormDto): Promise<Permission | null> {
        const defaultRole = await this._roleRepository.createDefaultRole();
        return await this._permissionRepository.create({
            name: form.name,
            code_name: form.code_name,
            role: defaultRole as Role
        })
    }

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<Permission[]>> {
        return await this._permissionRepository.findAllPaginate(query)
    }

    public async delete(id: number): Promise<Permission | null> {
        return await this._permissionRepository.delete(id)
    }

    public async findById(id: number): Promise<Permission | null> {
        return await this._permissionRepository.findById(id)
    }
}
