import "reflect-metadata";
import { UserService, UserServiceImpl } from "../user.service";
import { expect } from 'chai';
import { LoginUserDto, UserWithToken, CreateUserDto, UserData } from "../../dtos/user";
import { length } from "class-validator";
import { User, UserToken } from ".prisma/client";
import { hash } from "bcrypt";
import { UserRepositoryImpl } from "../../repositories/user.repository";
import { UserTokenRepository, UserTokenRepositoryImpl } from "../../repositories/userToken.repository";


const prisma = jestPrisma.client

describe("User Service", () => {
    let user: User
    let userRepository = new UserRepositoryImpl(prisma)
    let userTokenRepository = new UserTokenRepositoryImpl(prisma)
    let userService = new UserServiceImpl(userRepository, userTokenRepository)


    beforeEach(async () => {
        user = await prisma.user.create({
            data: {
                first_name: "fahmi",
                last_name: "hidayah",
                email: "fahmi@service.com",
                password: await hash("Test@1234", 10),
                email_verification_code: "123456789"
            }
        })
        userRepository = new UserRepositoryImpl(prisma)
        userTokenRepository = new UserTokenRepositoryImpl(prisma)
        userService = new UserServiceImpl(userRepository, userTokenRepository)

    })

    afterEach(async () => {
        await prisma.userToken.deleteMany()
        await prisma.user.deleteMany()
    });

    test("login success", async () => {
        const loginUserDto: LoginUserDto = {
            email: "fahmi@service.com",
            password: "Test@1234"
        }
        const userWithToken: UserWithToken = await userService.login(loginUserDto)
        expect(userWithToken.email).to.equal("fahmi@service.com")
    })

    test("register success", async () => {
        const createUserDto: CreateUserDto = {
            first_name: "fahmi",
            last_name: "hidayah",
            email: "fahmi@regService.com",
            password : "Test@1234"}

        const userData = await userService.register(createUserDto) as UserData
        expect(userData?.email).to.equal("fahmi@regService.com")
    })

    test('verify success', async () => {
        const userData = await userService.verify(user.email_verification_code)
        const userVerified = await userService.findById(user.id)
        expect(userVerified?.is_email_verified).equal(true)
    })

    test('refresh token success', async () => { 
        
        const loginUserDto: LoginUserDto = {
            email: "fahmi@service.com",
            password: "Test@1234"
        }
        const userWithToken: UserWithToken = await userService.login(loginUserDto)
        const token = userWithToken.refresh_token

        const userToken = await userService.refreshToken({refresh_token : token})
        expect(userToken).not.equal(null)
    })

})