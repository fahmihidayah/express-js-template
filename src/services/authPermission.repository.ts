import { AuthPermission } from "@prisma/client"
import { AuthPermissionDto } from "../dtos/auth.permission"
import { Query } from "../repositories/base"
import { PaginateList } from "../dtos"
import { inject, injectable } from "inversify"
import { TYPE_SERVICE } from "."
import { TYPE_REPOSITORY } from "../repositories"
import { AuthPermissionRepository } from "../repositories/authPermission.repository"
import { GetResult } from "@prisma/client/runtime/library"

export interface AuthPermissionService {

    create(form: AuthPermissionDto): Promise<AuthPermission | null>
    findAll(query: Query): Promise<PaginateList<Array<AuthPermission>>>
    delete(id: number): Promise<AuthPermission | null>
    findById(id: number): Promise<AuthPermission | null>

}

@injectable()
export class AuthPermissionImpl implements AuthPermissionService {
    constructor(@inject(TYPE_REPOSITORY.AuthPermissionRepository) private _authPermissionRepository: AuthPermissionRepository) { }

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
