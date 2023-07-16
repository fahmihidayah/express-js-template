import "reflect-metadata";
import { UserService, UserServiceImpl } from "../user.service";
import { TYPE_SERVICE } from "..";
import {expect} from 'chai';
import { LoginUserDto, UserWithToken, CreateUserDto, UserData } from "../../dtos/user";
import { GetResult } from "@prisma/client/runtime";
import { User } from "@prisma/client";
import { length } from "class-validator";

class MockUserService implements UserService {
    async findById(id: number): Promise<UserData | unknown> {
        if(id == -1) {
            return null
        }
        return {
            id : 1,
            name : 'fahmi',
            email : 'fahmi@gmail.com'
        }
    }
    async findAll(): Promise<User[]> {
        return [{
            id: 1,
            name: "fahmi",
            email: "fahmi@gmail.com",
            password: "123",
            created_at: new Date(),
            updated_at: new Date()
        }]
    }
    async login(loginForm: LoginUserDto): Promise<UserWithToken> {
        return {
            name: "fahmi",
            email: "fahmi@gmail.com",
            access_token: "1234",
            refresh_token: "1122"
        }
    }
    async register(registerForm: CreateUserDto): Promise<UserData> {
        return {
            id: 1,
            name: "fahmi",
            email: "1234"
        }
    }

}


describe("User Service", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new MockUserService()
    })

    it("test login success", async () => {
        expect(await userService.login({
            email: "fahmi@gmail.com",
            password: "Test123!"
        })).deep.equal({
            name: "fahmi",
            email: "fahmi@gmail.com",
            access_token: "1234",
            refresh_token: "1122"
        })
    })

    it("test get list users ", async () => {
        expect((await userService.findAll()).length).equal(1)
    })

    it('test register success', async() => {
        expect(await userService.register({
            name : "fahmi",
            email : "fahmi@gmail.com",
            password : "123456"
        })).deep.equal({
            id: 1,
            name: "fahmi",
            email: "1234"
        })
    })

    it('test find by id', async () => {
        expect(await userService.findById(1)).deep.equal({
            id : 1,
            name : "fahmi",
            email : "fahmi@gmail.com"
        })
    })
})