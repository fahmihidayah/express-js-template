import { Permission, User } from "@prisma/client"
import { PermissionFormDto, AuthPermissionNameDto } from "../dtos/permission"
import { Query } from "../repositories/base"
import { PaginateList } from "../dtos"
import { inject, injectable } from "inversify"
import { PermissionRepository, PermissionRepositoryImpl } from "../repositories/permission.repository"
import { GetResult } from "@prisma/client/runtime/library"
import { UserRepository, UserRepositoryImpl } from "../repositories/user.repository"
import { provide } from "inversify-binding-decorators"

export interface PermissionService {

    createFromName(form : AuthPermissionNameDto) : Promise<Array<Permission>>

    deleteByName(name : string) : Promise<boolean>

    create(form: PermissionFormDto): Promise<Permission | null>

    findAllPaginate(query: Query): Promise<PaginateList<Array<Permission>>>

    update(id : number, form : PermissionFormDto): Promise<Permission | null>

    delete(id: number): Promise<Permission | null>

    findById(id: number): Promise<Permission | null>

    addUser(PermissionId : number, userId : number) : Promise<Permission | null>

    removeUser(PermissionId : number, userId : number) : Promise<Permission | null>

    isUserHasPermissionName(user : User, name : Array<string>) : Promise<boolean> 

    isUserHasPermissionCodeName(user : User, codeName : Array<string>) : Promise<boolean> 


}

@provide(PermissionServiceImpl)
export class PermissionServiceImpl implements PermissionService {

    private _PermissionRepository: PermissionRepository;
    private _userRepository: UserRepository;
    constructor(
        PermissionRepository: PermissionRepositoryImpl,
        userRepository: UserRepositoryImpl,
        ) { 
            this._PermissionRepository = PermissionRepository
            this._userRepository = userRepository
        }

    public async isUserHasPermissionName(user: User, name: string[]): Promise<boolean> {
        const count = await this._PermissionRepository.countNamesByUser(name, user.id);
        return count >= 1;
    }
    
    public async isUserHasPermissionCodeName(user: User, codeName: string[]): Promise<boolean> {
        const count = await this._PermissionRepository.countCodeNamesByUser(codeName, user.id);
        return count >= 1;
    }

    public async deleteByName(name: string): Promise<boolean> {
        return await this._PermissionRepository.deleteByName(name)
    }

        
    public async createFromName(form: AuthPermissionNameDto): Promise<Permission[]> {
        const codeNames = ["create", "read", "update", "delete"];
        let listPermissions : Array<Permission> = [];
        for (let codeName of codeNames) {
            const Permission = await this._PermissionRepository.create({
                name : form.name,
                code_name : `${form.name}_${codeName}`
            })
            listPermissions.push(Permission!)
        }
        return listPermissions;
    }

    public async update(id: number, form: PermissionFormDto): Promise<Permission | null> {
        return await this._PermissionRepository.update(id, form)
    }

    public async addUser(PermissionId: number, userId: number): Promise<Permission | null> {
        const user = await this._userRepository.findById(userId)
        if (!user) {
            return null;
        }
        return await this._PermissionRepository.addUser(PermissionId, user?.user);
    }

    public async removeUser(PermissionId: number, userId: number): Promise<Permission | null> {
        return await this._PermissionRepository.removeUser(PermissionId, userId)
    }

    public async create(form: PermissionFormDto): Promise<Permission | null> {
        return await this._PermissionRepository.create(form)
    }

    public async findAllPaginate(query: Query): Promise<PaginateList<Permission[]>> {
        return await this._PermissionRepository.findAllPaginate(query)
    }

    public async delete(id: number): Promise<Permission | null> {
        return await this._PermissionRepository.delete(id)
    }

    public async findById(id: number): Promise<Permission | null> {
        return await this._PermissionRepository.findById(id)
    }
}
