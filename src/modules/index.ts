import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { prismaContainerModule } from "./prisma.container";
// import { validationMiddlewareContainerModule } from "./validation.middleware.module";
import { buildProviderModule } from "inversify-binding-decorators";
import { middleWareContainerModule } from "./middleware.container";

const container = new Container({ autoBindInjectable: true });

container.load(
    prismaContainerModule,
    middleWareContainerModule,
    buildProviderModule()
)

const port = process.env.PORT || 3000;

export const server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" });


