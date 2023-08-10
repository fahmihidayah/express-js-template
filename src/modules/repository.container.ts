import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_REPOSITORY } from "../repositories";
import { UserRepository, UserRepositoryImpl } from "../repositories/user.repository";
import { UserTokenRepository, UserTokenRepositoryImpl } from "../repositories/userToken.repository";
import { GroupRepository, GroupRepositoryImpl } from "../repositories/group.reposotry";
import { AuthPermissionRepository, AuthPermissionRepositoryImpl } from "../repositories/authPermission.repository";

export const repositoryContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<UserRepository>(TYPE_REPOSITORY.UserRepository).to(UserRepositoryImpl);
    bind<UserTokenRepository>(TYPE_REPOSITORY.UserTokenRepository).to(UserTokenRepositoryImpl);
    bind<GroupRepository>(TYPE_REPOSITORY.GroupRepository).to(GroupRepositoryImpl);
    bind<AuthPermissionRepository>(TYPE_REPOSITORY.AuthPermissionRepository).to(AuthPermissionRepositoryImpl);
})