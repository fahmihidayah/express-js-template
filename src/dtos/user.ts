import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    public email : string = "";

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    public password: string = "";
}

export class CreateUserDto {
    @MinLength(3)
    public name: string = ""

    @IsEmail()
    public email: string = "";

    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(32)
    public password: string = "";
}

export class UpdateUserFormDto {
    
    public name: string | null = null

    public email: string | null = null;

    public password: string | null = null;
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(32)
    public password: string = "";
}


export type UserData = {
    id: number;
    name: string;
    email: string;
}

export type UserWithToken = {
    name: string;
    email: string;
    access_token: string;
    refresh_token: string;
    expire_in : number;
}