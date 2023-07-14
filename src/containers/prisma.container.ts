import { Prisma, PrismaClient, User } from "@prisma/client";
import { Container } from "inversify";


export const TYPE_PRISMA = {
    PrismaClient: Symbol.for("PrismaClient")
}

export const prismaContainer = new Container();

prismaContainer.bind<PrismaClient>(TYPE_PRISMA.PrismaClient).toConstantValue(new PrismaClient())