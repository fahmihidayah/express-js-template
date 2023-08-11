import { IsNotEmpty } from "class-validator";

export class AuthPermissionDto {

    @IsNotEmpty()
    public name : string = "";

    @IsNotEmpty()
    public code_name : string = "";
    
}

export class AuthPermissionNameDto {
    @IsNotEmpty()
    public name : string = "";
}

export class AuthPermissionWithUser {
    @IsNotEmpty()
    public user_id : string = ""
}