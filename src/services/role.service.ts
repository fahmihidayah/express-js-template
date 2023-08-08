import { Role } from "@prisma/client";
import { inject, injectable } from "inversify";
import { RoleDto } from "../dtos/role";
import { GetResult } from "@prisma/client/runtime/library";
import { TYPE_REPOSITORY } from "../repositories";
import { RoleRepository } from "../repositories/role.repository";

export interface RoleService {
    findAll() : Promise<Role[]>
    create(roleDto : RoleDto) : Promise<Role|null>
    findById(id : number) : Promise<Role|null>
}

@injectable()
export class RoleServiceImpl implements RoleService {

    constructor(@inject(TYPE_REPOSITORY.RoleRepository) private _roleRepository : RoleRepository) {

    }

    public async findAll(): Promise<Role[]> {
        return await this._roleRepository.findAll();
    }

    public async create(roleDto: RoleDto): Promise<Role | null> {
        return await this._roleRepository.create(roleDto);
    }

    public async findById(id: number): Promise<Role | null> {
        return await this._roleRepository.findById(id);
    }

}