import { Role, User } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, isNotEmpty } from 'class-validator';
import { TokenData } from '../interfaces/auth.interfaces';

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

export class UserData {
    constructor (
        public user: User,
        public roles : Role[] = []
    ) {

    }

    toUserNoPassword() : UserNoPassword {
        return {
            id: this.user.id,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            is_email_verified: this.user.is_email_verified,
            created_at: this.user.created_at,
            updated_at: this.user.updated_at
        }
    }

    toUserWithToken(tokenData : TokenData) : UserWithToken {
        return {
            id: this.user.id,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            is_email_verified: this.user.is_email_verified,
            created_at: this.user.created_at,
            updated_at: this.user.updated_at,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expire_in: tokenData.expire_in
        }
    }
}

export interface UserNoPassword  {
    id: number | null;
    first_name: string | null;
    last_name: string | null;
    is_email_verified : boolean | false;
    email: string | null;
    created_at : Date | null;
    updated_at : Date | null;
}

export interface UserWithToken extends UserNoPassword{
    access_token: string;
    refresh_token: string;
    expire_in : number;
}

export interface RefreshToken {
    token : string
}