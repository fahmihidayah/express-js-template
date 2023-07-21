import { User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto, UpdateUserFormDto, UserData } from "../dtos/user";

export interface UserRepository {
    create(user : CreateUserDto) : Promise<User | null>
    
    findByEmail(email : string) : Promise<User | null>

    findById(id : number) : Promise<User | null>

    update(id : number, userForm : UpdateUserFormDto) : Promise<User | null>

    findAll() : Promise<User[]>
}