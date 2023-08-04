import "reflect-metadata";
import { UserService, UserServiceImpl } from "../user.service";
import { TYPE_SERVICE } from "..";
import { expect } from 'chai';
import { LoginUserDto, UserWithToken, CreateUserDto, UserData } from "../../dtos/user";
import { length } from "class-validator";
import { UserRepositoryImpl } from "../../prisma/repositories/user.repository";
import { prismaMock } from "../../prisma/singleton";
import { User } from ".prisma/client";
import { hash } from "bcrypt";

function createUserService(): UserService {
    return new UserServiceImpl(new UserRepositoryImpl(prismaMock))
}

async function getSampleUser(id : number = 1): Promise<User> {
    return {
        id: id,
        first_name: 'fahmi',
        last_name : "hidayah",
        email: 'fahmi@gmail.com',
        password: await hash("Test@1234", 10),
        created_at: new Date(),
        updated_at: new Date(),
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

        let userWithToken = await userService.login(getLoginUserDto());

        expect(userWithToken.email).equal("fahmi@gmail.com");
    })

    it("find all user", async () => {
        prismaMock.user.findMany.mockResolvedValue([await getSampleUser()])

        let users = await userService.findAll();

        expect(users.length).equal(1)
    })

    it('find user by id', async () => {
        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser());

        let user = await userService.findById(1) as User;

        expect(user.email).equal("fahmi@gmail.com")
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