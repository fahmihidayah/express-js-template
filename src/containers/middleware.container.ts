import { Container } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_SERVICE } from "../services";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";
import { TYPE_MIDDLEWARE } from "../middlewares";

export const middlewareContainer = new Container();

middlewareContainer.bind<AuthMiddleware>(TYPE_MIDDLEWARE.AuthMiddleware).to(AuthMiddleware)
middlewareContainer.bind<ErrorMiddleware>(TYPE_MIDDLEWARE.ErrorMiddleware).to(ErrorMiddleware)