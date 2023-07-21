import { CreateUserDto, UpdateUserDto, UpdateUserFormDto } from "../../dtos/user";
import { UserRepository } from "../../repositories/user.repository";
import { inject, injectable } from "inversify";
import { PrismaClient, User } from "@prisma/client";
import { TYPE_PRISMA } from "../../modules/prisma.container";

@injectable()
export class UserRepositoryImpl implements UserRepository {

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private _prismaClient: PrismaClient
    ) {

    }

    async findById(id: number): Promise<User | null> {
        return await this._prismaClient.user.findUnique({
            where: {
                id: id
            }
        })
    }

    async create(user: CreateUserDto): Promise<User | null> {
        return await this._prismaClient.user.create({
            data: user
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this._prismaClient.user.findUnique({
            where: {
                email: email
            }
        })
    }

    async update(id: number, userForm: UpdateUserFormDto): Promise<User | null> {
        let user = await this.findById(id)
        let updatedUserForm = {
            ... user
        }

        if(userForm.email) {
            updatedUserForm.email = userForm.email
        }
        
        if(userForm.name) {
            updatedUserForm.name = userForm.name
        }

        if(userForm.password) {
            updatedUserForm.password = userForm.password
        }

        return await this._prismaClient.user.update({
            where: {
                id: id
            },
            data: updatedUserForm
        })
    }

    async findAll(): Promise<User[]> {
        return await this._prismaClient.user.findMany();
    }

}