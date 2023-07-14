import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { serviceContainer } from "./service.container";
import { middlewareContainer } from "./middleware.container";
import { prismaContainer } from "./prisma.container";

let container = Container.merge(
    serviceContainer,
    middlewareContainer
)

container = Container.merge(container, prismaContainer)

const port = process.env.PORT || 3000;

export const server = new InversifyExpressServer(container, null, {rootPath: "/api/v1"});


