import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";
import { TYPE_MIDDLEWARE } from "../middlewares";
import { ValidationMiddleware } from "../middlewares/validation";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "../dtos/user";
import { GroupDto, GroupWithAuthPermission, GroupWithUser } from "../dtos/group";
import { AuthPermissionDto, AuthPermissionNameDto, AuthPermissionWithUser } from "../dtos/auth.permission";

export const TYPE_MIDDLWARE_VALIDATION = {
    LoginValidationMiddleware: Symbol.for("LoginValidationMiddleware"),
    RegisterValidationMiddleware: Symbol.for("RegisterValidationMiddleware"),
    RefreshTokenValidationMiddleware: Symbol.for("RefreshTokenValidationMiddleware"),

    GroupValidationMiddleware: Symbol.for("GroupValidationMiddleware"),
    GroupWithUserValidationMiddleware: Symbol.for("GroupWithUserValidationMiddleware"),
    GroupWithAuthPermissionValidationMiddleware: Symbol.for("GroupWithAuthPermissionValidationMiddleware"),

    AuthPermissionValidationMiddleware: Symbol.for("AuthPermissionValidationMiddleware"),
    AuthPermissionNameValidationMiddleware: Symbol.for("AuthPermissionNameValidationMiddleware"),
    AuthPermissionWithUserValidationMiddleware: Symbol.for("AuthPermissionWithUserValidationMiddleware"),

}

export const validationMiddlewareContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.LoginValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(LoginUserDto))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.RegisterValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(CreateUserDto))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.RefreshTokenValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(RefreshTokenDto))

    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.GroupValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(GroupDto))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.GroupWithUserValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(GroupWithUser))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.GroupWithAuthPermissionValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(GroupWithAuthPermission))


    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.AuthPermissionValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(AuthPermissionDto))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.AuthPermissionNameValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(AuthPermissionNameDto))
    bind<ValidationMiddleware>(TYPE_MIDDLWARE_VALIDATION.AuthPermissionWithUserValidationMiddleware)
        .toConstantValue(new ValidationMiddleware(AuthPermissionWithUser))

});
