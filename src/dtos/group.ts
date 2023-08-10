import { IsNotEmpty } from "class-validator";

export class GroupDto {
    @IsNotEmpty()
    public name : string = "";
}

