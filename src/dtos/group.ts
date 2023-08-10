import { IsNotEmpty } from "class-validator";

export class GroupDto {
    @IsNotEmpty()
    public name : string = "";
}

export class GroupWithUser {
    @IsNotEmpty()
    public user_id : string = ""
}

export class GroupWithAuthPermission {
    @IsNotEmpty()
    public auth_permission_id : string = ""
}