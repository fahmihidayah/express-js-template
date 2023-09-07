import { Role } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class RoleFormDto {
    @IsNotEmpty()
    public name : string = "";
}

export class RoleDto {
    
    constructor (
        public role :  Role
    ) {

    }
}

// potentially not used

export class RoleWithUser {
    @IsNotEmpty()
    public user_id : string = ""
}

export class GroupWithAuthPermission {
    @IsNotEmpty()
    public auth_permission_id : string = ""
}