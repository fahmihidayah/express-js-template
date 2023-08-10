import { Container, ContainerModule, interfaces } from "inversify";
import { UserService, UserServiceImpl } from "../services/user.service";
import { TYPE_SERVICE } from "../services";
import { GroupService, GroupServiceImpl } from "../services/group.service";

export const serviceContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<UserService>(TYPE_SERVICE.UserService).to(UserServiceImpl);
    bind<GroupService>(TYPE_SERVICE.GroupService).to(GroupServiceImpl);
})