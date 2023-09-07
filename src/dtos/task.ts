import { Task } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class TaskFormDto {
    @IsNotEmpty()
    title: string = ""
    @IsNotEmpty()
    description: string = ""

    completed: boolean = false;
}

export class TaskData {
    constructor(
        public task : Task
    ) {

    }
}