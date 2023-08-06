import "reflect-metadata";
import { UserRepository, UserRepositoryImpl } from "../user.repository"
import { expect } from "chai";
import { User } from ".prisma/client";
import {prismaMock} from "../../../prisma/singleton";


function createUserRepository(): UserRepository {
    return new UserRepositoryImpl(prismaMock)
}

function getSampleUser(): User {
    return {
        id: 1,
        first_name: 'fahmi',
        last_name : "hidayah",
        email: 'fahmi@gmail.com',
        is_email_verified : false,
        email_verification_code : `123456789`,
        password: "Test@1234",
        created_at: new Date(),
        updated_at: new Date(),
    }
}

describe('user repository', () => {
    let userRepository: UserRepository = createUserRepository();
    let user = getSampleUser()

    test("create user success", async () => {

        const userDto = {

            first_name: 'fahmi',
            last_name: "hidayah",
            email: "fahmi@gmail.com",
            password: "Test@1234"
        }

        prismaMock.user.create.mockResolvedValue(user)

        const newUser = await userRepository?.create(userDto)
        expect(newUser?.first_name).equal("fahmi")
    })

    test('find all users success', async () => {

        prismaMock.user.findMany.mockResolvedValue([user])

        const result = await userRepository?.findAll({page: 1, take : 10});

        expect(result.data.length).equal(1)
    })

    test('find user by id', async () => {
        prismaMock.user.findUnique.mockResolvedValue(user)

        const result = await userRepository?.findById(1)

        expect(result?.email).equal('fahmi@gmail.com')
    })

    test('find user by email', async () => {
        prismaMock.user.findUnique.mockResolvedValue(user)

        const result = await userRepository?.findByEmail('fahmi@gmail.com')

        expect(result?.email).equal('fahmi@gmail.com')
    })

    test('update all user fields by id success', async () => {
        prismaMock.user.findUnique.mockResolvedValue(user)
        prismaMock.user.update.mockResolvedValue({
            ...user, email: "fahmi@testmail.com"
        })
        const result = await userRepository.update(user.id, {

            first_name: 'fahmi',
            last_name: "hidayah",
            email: "fahmi@testmail.com",
            password: "Test123!"
        })

        expect(result?.email).equal('fahmi@testmail.com')
    })

    test('update single user fields by id success', async () => {
        prismaMock.user.findUnique.mockResolvedValue(user)
        prismaMock.user.update.mockResolvedValue({
            ...user, email: "abc@testmail.com"
        })
        const result = await userRepository.update(user?.id!!, {
            first_name: null,
            last_name: null,
            email: "abc@testmail.com",
            password: null
        })

        expect(result?.email).equal("abc@testmail.com")
    })

    test('findByVerifyCode failure', async () => {
        // prismaMock.user.findFirst.mockResolvedValue(user)
       
        const result = await userRepository.findByVerifyCode("987654321")

        expect(result).equal(undefined)
    })

    test('findByVerifyVode success', async () => {
        prismaMock.user.findFirst.mockResolvedValue(user)
       
        const result = await userRepository.findByVerifyCode("123456789")

        expect(result?.id).equal(1)
    })

})