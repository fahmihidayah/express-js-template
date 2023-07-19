import "reflect-metadata";
import { UserService, UserServiceImpl } from "../user.service";
import { TYPE_SERVICE } from "..";
import {expect} from 'chai';
import { LoginUserDto, UserWithToken, CreateUserDto, UserData } from "../../dtos/user";
import { GetResult } from "@prisma/client/runtime";
import { User } from "@prisma/client";
import { length } from "class-validator";
import { UserRepositoryImpl } from "../../prisma/repositories/user.repository";

describe("Register User Service", () => {
    let userService: UserService;

    beforeEach(async () => {
        userService = new UserServiceImpl(new UserRepositoryImpl(jestPrisma.client))
    })

    it("register user success", async () => {
        let user : User = await userService.register({
            name : "fahmi",
            email : "fahmi@service.com",
            password : "Test1234!"
        }) as User
        expect(user.email).equal("fahmi@service.com")
    } )
})

describe("Login User Service", () => {
    let userService: UserService;

    beforeEach(async () => {
        userService = new UserServiceImpl(new UserRepositoryImpl(jestPrisma.client))
    })

    it("login user success", async () => {
        let user : User = await userService.register({
            name : "fahmi",
            email : "fahmi@service.com",
            password : "Test1234!"
        }) as User
        let userWithToken = await userService.login({
            email : "fahmi@service.com",
            password : "Test1234!"
        });
        expect(userWithToken.email).equal("fahmi@service.com");
    })
})

describe("Find User Service", () => {
    let userService: UserService;

    beforeEach(async () => {
        userService = new UserServiceImpl(new UserRepositoryImpl(jestPrisma.client))
    })

    it("find all user return 1", async () => {
        let user : User = await userService.register({
            name : "fahmi",
            email : "fahmi@service.com",
            password : "Test1234!"
        }) as User
        let users = await userService.findAll();
        expect(users.length).not.equal(0)
    })
})


describe("Find User by id Service", () => {
    let userService: UserService;

    beforeEach(async () => {
        userService = new UserServiceImpl(new UserRepositoryImpl(jestPrisma.client))
    })

    it("find all user return 1", async () => {
        let user : User = await userService.register({
            name : "fahmi",
            email : "fahmi@service.com",
            password : "Test1234!"
        }) as User
        let findUser = await userService.findById(user.id) as User;
        expect(findUser.email).equal(user.email);
    })
})