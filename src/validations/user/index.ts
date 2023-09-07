import 'reflect-metadata';
import { provide } from "inversify-binding-decorators";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "../../dtos/user";
import { BaseValidationMiddleware, ValidationMiddleware } from "../../middlewares/validation";

@provide(LoginUserValidationMiddleware)
export class LoginUserValidationMiddleware extends BaseValidationMiddleware {
    _type: any = LoginUserDto;
    _skipMissingProperties: boolean = false;
    _whitelist: boolean = false;
    _forbidNonWhitelisted: boolean = false;
    
}

@provide(CreateUserValidationMiddleware)
export class CreateUserValidationMiddleware extends BaseValidationMiddleware {
    _type: any = CreateUserDto;
    _skipMissingProperties: boolean = false;
    _whitelist: boolean = false;
    _forbidNonWhitelisted: boolean = false;
}

@provide(RefreshTokenValidationMiddleware)
export class RefreshTokenValidationMiddleware extends BaseValidationMiddleware {
    _type: any = RefreshTokenDto;
    _skipMissingProperties: boolean = false;
    _whitelist: boolean = false;
    _forbidNonWhitelisted: boolean = false;
}