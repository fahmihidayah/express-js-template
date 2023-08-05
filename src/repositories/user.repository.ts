import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto, UpdateUserFormDto, UserData } from "../dtos/user";

export interface UserRepository {
    create(user : CreateUserDto) : Promise<User | null>
    
    findByEmail(email : string) : Promise<User | null>

    findById(id : number) : Promise<User | null>

    update(id : number, userForm : UpdateUserFormDto) : Promise<User | null>

    findAll(usersQuery : UsersQuery) : Promise<User[]>
}

import { inject, injectable } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { UsersQuery } from ".";

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
        
        if(userForm.first_name) {
            updatedUserForm.first_name = userForm.first_name
        }
        
        if(userForm.last_name) {
            updatedUserForm.last_name = userForm.last_name
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

    async findAll(usersQuery : UsersQuery = {page : 1, take : 10}): Promise<User[]> {
        const {page, take} = usersQuery;
        const skip : number = (page - 1) * take;
        return await this._prismaClient.user.findMany({
            skip : skip, 
            take : take
        });
    }

}