import 'reflect-metadata';
import { BaseMiddleware } from "inversify-express-utils";
import { BaseValidationMiddleware } from "../../middlewares/validation";
import { TaskFormDto } from "../../dtos/task";
import { provide } from "inversify-binding-decorators";


@provide(TaskFormValidationMiddleware)
export class TaskFormValidationMiddleware extends BaseValidationMiddleware {
    _type: any = TaskFormDto;
    _skipMissingProperties: boolean = false;
    _whitelist: boolean = false;
    _forbidNonWhitelisted: boolean = false;

}