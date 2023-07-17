import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_REPOSITORY } from "../repositories";
import { UserRepositoryImpl } from "../prisma/repositories/user.repository";
import { UserRepository } from "../repositories/user.repository";

export const repositoryContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<UserRepository>(TYPE_REPOSITORY.UserRepository).to(UserRepositoryImpl);
})