import { Container } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_SERVICE } from "../services";

export const serviceContainer = new Container();

serviceContainer.bind<UserService>(TYPE_SERVICE.UserService).to(UserServiceImpl);