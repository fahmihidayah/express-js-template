import { User } from "@prisma/client";
import { CreateUserDto, UserData } from "../dtos/user";

export interface UserRepository {
    createUser(user : CreateUserDto) : Promise<User | null>
    
    findByEmail(email : string) : Promise<User | null>

    findById(id : number) : Promise<User | null>

    update(id : number, user : CreateUserDto) : Promise<User | null>

    findAll() : Promise<User[]>
}