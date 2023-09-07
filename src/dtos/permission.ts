import { Permission, Role } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class PermissionFormDto {

    @IsNotEmpty()
    public name : string = "";

    @IsNotEmpty()
    public code_name : string = "";
    
}

export class PermissionFormWithRoleDto extends PermissionFormDto {
    
    constructor(
        public role : Role,
    ){
        super()
    }
}

export class PermissionDto {
    constructor (
        public permission :  Permission
    ) {

    }
}

// potentially not used

export class AuthPermissionNameDto {
    @IsNotEmpty()
    public name : string = "";
}

export class AuthPermissionWithUser {
    @IsNotEmpty()
    public user_id : string = ""
}