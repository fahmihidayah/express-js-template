import "reflect-metadata";
import { UserService, UserServiceImpl } from "../user.service";
import { TYPE_SERVICE } from "..";
import { expect } from 'chai';
import { LoginUserDto, UserWithToken, CreateUserDto, UserData } from "../../dtos/user";
import { length } from "class-validator";
import { User, UserToken } from ".prisma/client";
import { hash } from "bcrypt";

import {prismaMock} from "../../../prisma/singleton";
import { UserRepositoryImpl } from "../../repositories/user.repository";
import { UserTokenRepositoryImpl } from "../../repositories/userToken.repository";

function createUserService(): UserService {
    return new UserServiceImpl(new UserRepositoryImpl(prismaMock), new UserTokenRepositoryImpl(prismaMock))
}

async function getSampleUser(id : number = 1): Promise<User> {
    return {
        id: 1,
        first_name: 'fahmi',
        last_name : "hidayah",
        email: 'fahmi@gmail.com',
        is_email_verified : false,
        email_verification_code : "",
        is_admin : false,
        password: await hash("Test@1234", 10),
        created_at: new Date(),
        updated_at: new Date(),
    }
}

async function getUserToken() : Promise<UserToken> {
    return {
        id : 1,
        user_id : 1,
        token : "123456789",
        created_at : new Date(),
        updated_at : new Date(),
    }
}

function getUserDto(): CreateUserDto {
    return {
        first_name: 'fahmi',
        last_name : "hidayah",
        email: "fahmi@gmail.com",
        password: "Test@1234"
    }
}

function getLoginUserDto(): LoginUserDto {
    return {
        email : "fahmi@gmail.com",
        password : "Test@1234"
    }
}

describe("User Service", () => {
    let userService: UserService = createUserService();

    test("register user success", async () => {
        prismaMock.user.create.mockResolvedValue(await getSampleUser())

        let user = await userService.register(getUserDto()) as User;

        expect(user.email).equal("fahmi@gmail.com")
    })

    test('login user success', async() => {
        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())
        prismaMock.userToken.create.mockResolvedValue(await getUserToken());

        let userWithToken = await userService.login(getLoginUserDto());

        expect(userWithToken.email).equal("fahmi@gmail.com");
    })

    it("find all user", async () => {
        prismaMock.user.findMany.mockResolvedValue([await getSampleUser()])

        let users = await userService.findAll({page : 1, take: 10, keyword : ""});

        expect(users.data.length).equal(1)
    })

    it('find user by id', async () => {
        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser());

        let user = await userService.findById(1) as User;

        expect(user.email).equal("fahmi@gmail.com")
    })

    it('refresh token success', async () => {
        prismaMock.userToken.findFirst.mockResolvedValue(await getUserToken());
        let token = await userService.refreshToken({
            refreshToken : "123456789"
        });
        expect(token).not.null;
    })
})


// describe("Find User Service", () => {
//     let userService: UserService;

//     beforeEach(async () => {
//         userService = new UserServiceImpl(new UserRepositoryImpl(jestPrisma.client))
//     })

//     it("find all user return 1", async () => {
//         let user : User = await userService.register({
//             name : "fahmi",
//             email : "fahmi@service.com",
//             password : "Test1234!"
//         }) as User
//         let users = await userService.findAll();
//         expect(users.length).not.equal(0)
//     })
// })


// describe("Find User by id Service", () => {
//     let userService: UserService;

//     beforeEach(async () => {
//         userService = new UserServiceImpl(new UserRepositoryImpl(jestPrisma.client))
//     })

//     it("find all user return 1", async () => {
//         let user : User = await userService.register({
//             name : "fahmi",
//             email : "fahmi@service.com",
//             password : "Test1234!"
//         }) as User
//         let findUser = await userService.findById(user.id) as User;
//         expect(findUser.email).equal(user.email);
//     })
// })