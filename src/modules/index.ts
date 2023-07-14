import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { prismaContainerModule } from "./prisma.container";
import { middleWareContainerModule } from "./middleware.container";
import { serviceContainerModule } from "./service.container";
import { validationMiddlewareContainerModule } from "./validation.middleware.module";

function mergeContainer(containers: Array<Container>): Container {
    let finalContainer: any = containers[0];
    containers.forEach(container => {
        if (finalContainer !== container) {
            finalContainer = Container.merge(finalContainer, container)
        }
    })
    return finalContainer
}

const container = new Container();

container.load(
    prismaContainerModule,
    middleWareContainerModule,
    serviceContainerModule,
    validationMiddlewareContainerModule)

const port = process.env.PORT || 3000;

export const server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" });


