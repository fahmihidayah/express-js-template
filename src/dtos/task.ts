import { Category, Task } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class TaskFormDto {
    @IsNotEmpty()
    title: string = ""
    @IsNotEmpty()
    description: string = ""

    completed: boolean = false;
}

export class TaskWithCategoryFormDto extends TaskFormDto{
    constructor(
        public category : Category
    ) {
        super();
    }
}

export class TaskData {
    constructor(
        public task : Task
    ) {

    }
}