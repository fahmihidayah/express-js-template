import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_REPOSITORY } from "../repositories";
import { UserRepository, UserRepositoryImpl } from "../repositories/user.repository";
import { UserTokenRepository, UserTokenRepositoryImpl } from "../repositories/userToken.repository";
import { RoleRepository, RoleRepositoryImpl } from "../repositories/role.repository";

export const repositoryContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<UserRepository>(TYPE_REPOSITORY.UserRepository).to(UserRepositoryImpl);
    bind<UserTokenRepository>(TYPE_REPOSITORY.UserTokenRepository).to(UserTokenRepositoryImpl);
    bind<RoleRepository>(TYPE_REPOSITORY.RoleRepository).to(RoleRepositoryImpl);
})