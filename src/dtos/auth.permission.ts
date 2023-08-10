import { IsNotEmpty } from "class-validator";

export class AuthPermissionDto {

    @IsNotEmpty()
    public name : string = "";

    @IsNotEmpty()
    public code_name : string = "";
    
}