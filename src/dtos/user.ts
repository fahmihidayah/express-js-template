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


export interface UserData  {
    id: number | null;
    name: string | null;
    email: string | null;
    created_at : Date | null;
    updated_at : Date | null;
}

export interface UserWithToken {
    name: string;
    email: string;
    access_token: string;
    refresh_token: string;
    expire_in : number;
}