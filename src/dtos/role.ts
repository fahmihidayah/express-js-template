import { IsNotEmpty } from "class-validator";

export class RoleDto {
    @IsNotEmpty()
    public name : string = "";
}