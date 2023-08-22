import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, isNotEmpty } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    public email : string = "";

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    public password: string = "";
}

export class RefreshTokenDto {
    @IsNotEmpty()
    public refresh_token : string = "";
}

export class CreateUserDto {
    @MinLength(3)
    public first_name: string = ""
    @MinLength(3)
    public last_name: string = ""

    @IsEmail()
    public email: string = "";

    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(32)
    public password: string = "";
}

export class UpdateUserFormDto {
    
    public first_name: string | null = null

    public last_name: string | null = null

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
    first_name: string | null;
    last_name: string | null;
    is_email_verified : boolean | false;
    email: string | null;
    created_at : Date | null;
    updated_at : Date | null;
}

export interface UserWithToken {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    access_token: string;
    refresh_token: string;
    expire_in : number;
}

export interface RefreshToken {
    token : string
}