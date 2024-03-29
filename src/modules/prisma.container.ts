import { Prisma, PrismaClient, User } from "@prisma/client";
import { Container, ContainerModule, interfaces } from "inversify";
import prisma from "../../prisma/index";

export const TYPE_PRISMA = {
    PrismaClient: Symbol.for("PrismaClient")
}

export const prismaContainerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<PrismaClient>(TYPE_PRISMA.PrismaClient).toConstantValue(prisma)
});