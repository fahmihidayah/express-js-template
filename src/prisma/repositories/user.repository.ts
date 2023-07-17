import { GetResult } from "@prisma/client/runtime";
import { CreateUserDto } from "../../dtos/user";
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
        return await this._prismaClient.user.findFirst({
            where: {
                id: id
            }
        })
    }

    async createUser(user: CreateUserDto): Promise<User | null> {
        return await this._prismaClient.user.create({
            data: user
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this._prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
    }

    async update(id: number, user: CreateUserDto): Promise<User | null> {
        return await this._prismaClient.user.update({
            where: {
                id: id
            },
            data: user
        })
    }

    async findAll(): Promise<User[]> {
        return await this._prismaClient.user.findMany();
    }

}