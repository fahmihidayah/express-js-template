import { AuthPermission, User } from "@prisma/client"
import { AuthPermissionDto, AuthPermissionNameDto } from "../dtos/auth.permission"
import { Query } from "../repositories/base"
import { PaginateList } from "../dtos"
import { inject, injectable } from "inversify"
import { TYPE_SERVICE } from "."
import { TYPE_REPOSITORY } from "../repositories"
import { AuthPermissionRepository } from "../repositories/authPermission.repository"
import { GetResult } from "@prisma/client/runtime/library"
import { UserRepository } from "../repositories/user.repository"

export interface AuthPermissionService {

    create(form: AuthPermissionDto): Promise<AuthPermission | null>
    createFromName(form : AuthPermissionNameDto) : Promise<Array<AuthPermission>>
    deleteByName(name : string) : Promise<boolean>
    findAll(query: Query): Promise<PaginateList<Array<AuthPermission>>>
    update(id : number, form : AuthPermissionDto): Promise<AuthPermission | null>
    delete(id: number): Promise<AuthPermission | null>
    findById(id: number): Promise<AuthPermission | null>

    addUser(authPermissionId : number, userId : number) : Promise<AuthPermission | null>
    removeUser(authPermissionId : number, userId : number) : Promise<AuthPermission | null>

}

@injectable()
export class AuthPermissionImpl implements AuthPermissionService {
    constructor(
        @inject(TYPE_REPOSITORY.AuthPermissionRepository) private _authPermissionRepository: AuthPermissionRepository,
        @inject(TYPE_REPOSITORY.UserRepository) private _userRepository: UserRepository,
        ) { }
    public async deleteByName(name: string): Promise<boolean> {
        return await this._authPermissionRepository.deleteByName(name)
    }

        
    public async createFromName(form: AuthPermissionNameDto): Promise<AuthPermission[]> {
        const codeNames = ["create", "read", "update", "delete"];
        let listAuthPermissions : Array<AuthPermission> = [];
        for (let codeName of codeNames) {
            const authPermission = await this._authPermissionRepository.create({
                name : form.name,
                code_name : `${form.name}_${codeName}`
            })
            listAuthPermissions.push(authPermission!)
        }
        return listAuthPermissions;
    }

    public async update(id: number, form: AuthPermissionDto): Promise<AuthPermission | null> {
        return await this._authPermissionRepository.update(id, form)
    }

    public async addUser(authPermissionId: number, userId: number): Promise<AuthPermission | null> {
        const user = await this._userRepository.findById(userId) as User
        return await this._authPermissionRepository.addUser(authPermissionId, user);
    }

    public async removeUser(authPermissionId: number, userId: number): Promise<AuthPermission | null> {
        const user = await this._userRepository.findById(userId) as User;
        return await this._authPermissionRepository.removeUser(authPermissionId, user)
    }

    public async create(form: AuthPermissionDto): Promise<AuthPermission | null> {
        return await this._authPermissionRepository.create(form)
    }

    public async findAll(query: Query): Promise<PaginateList<AuthPermission[]>> {
        return await this._authPermissionRepository.findAll(query)
    }

    public async delete(id: number): Promise<AuthPermission | null> {
        return await this._authPermissionRepository.delete(id)
    }

    public async findById(id: number): Promise<AuthPermission | null> {
        return await this._authPermissionRepository.findById(id)
    }
}