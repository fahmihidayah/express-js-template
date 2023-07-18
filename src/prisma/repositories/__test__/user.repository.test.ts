import "reflect-metadata";
import { PrismaClient, User } from "@prisma/client"
import { mocked } from "jest-mock";
import { createMockContext } from "../../context"
import { UserRepository } from "../../../repositories/user.repository"
import { UserRepositoryImpl } from "../user.repository";
import { expect } from "chai";


function createUserRepository(): UserRepository {
    return new UserRepositoryImpl(jestPrisma.client)
}

async function createUser(userRepository: UserRepository) : Promise<User|null> {
    return await userRepository?.createUser({
        name: "fahmi",
        email: "fahmi@test.com",
        password: "1234Test!"
    })
}

describe('create user', () => {
    let userRepository: UserRepository | null;

    beforeEach(() => {
        userRepository = createUserRepository()
    })

    const userDto = {
        name: "fahmi",
        email: "fahmi@test.com",
        password: "1234Test!"
    }

    it("success created", async () => {
        const userData = await userRepository?.createUser(userDto)
        expect(userData?.name).equal("fahmi")
    })
})

describe('find all users', () => {
    let userRepository: UserRepository

    beforeEach(async () => {
        userRepository = createUserRepository()
        await createUser(userRepository)
    })

    it("Test find all user success", async () => {
        const result = await userRepository?.findAll()

        expect(result?.length).equal(1)
    })

})

describe('find user by id', () => {
    let userRepository: UserRepository
    let user : User | null 

    beforeEach(async () => {
        userRepository = createUserRepository()
        user = await createUser(userRepository)
    })

    it('Test find user by id success', async () => {
        const result = await userRepository?.findById(user?.id!!);
        expect(result?.id).deep.equal(user?.id)
    })
})

describe('find user by email', () => {
    let userRepository: UserRepository
    let user : User | null 

    beforeEach(async () => {
        userRepository = createUserRepository();
        user = await createUser(userRepository)
    })

    it('Test find user by email success', async () => {
        const result = await userRepository?.findByEmail(user?.email!!)
        expect(result?.id).equal(user?.id)
    })
})

describe('update user by id', () => {
    let userRepository : UserRepository
    let user : User | null 

    beforeEach( async () => {
        userRepository = createUserRepository()
        user = await createUser(userRepository)
    })

    it('test update all user fields by id success', async () => {
        const result = await userRepository.update(user?.id!!, {
            name : "fahmi",
            email: "fahmi@testmail.com",
            password : "Test123!"
        })

        expect(result?.email).equal('fahmi@testmail.com')
    })

    it('test update single user fields by id success', async () => {
        const result = await userRepository.update(user?.id!!, {
            name : null,
            email : "abc@gmail.com",
            password : null
        })

        expect(result?.email).equal("abc@gmail.com")
    })
})