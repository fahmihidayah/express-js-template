import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_SERVICE } from "../services";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";
import { TYPE_MIDDLEWARE } from "../middlewares";
import { ValidationMiddleware } from "../middlewares/validation";
import { CreateUserDto, LoginUserDto } from "../dtos/user";

export const TYPE_MIDDLWARE_VALIDATION = {
    LoginValidationMiddleware : Symbol.for("LoginValidationMiddleware"),
    RegisterValidationMiddleware : Symbol.for("RegisterValidationMiddleware"),
  }

export const validationMiddlewareContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.LoginValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(LoginUserDto))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.RegisterValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(CreateUserDto))
});
