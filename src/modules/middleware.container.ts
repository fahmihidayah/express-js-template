import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";
import { TYPE_MIDDLEWARE } from "../middlewares";

export const middleWareContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<AuthMiddleware>(TYPE_MIDDLEWARE.AuthMiddleware).to(AuthMiddleware)
    bind<ErrorMiddleware>(TYPE_MIDDLEWARE.ErrorMiddleware).to(ErrorMiddleware)
});
