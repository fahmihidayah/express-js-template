import "reflect-metadata";
import { UserRepository, UserRepositoryImpl } from "../user.repository"
import { expect } from "chai";
import { User } from ".prisma/client";
import { before } from "node:test";
import { BaseQuery } from "../base";

const prisma = jestPrisma.client
describe('user repository', () => {
    let user : User;
    let userRepository : UserRepository;

    beforeEach(async () => {
        user = await prisma.user.create({
            data: {
                first_name: 'fahmi',
                last_name: "hidayah",
                email: "fahmi@test.com",
                password: "Test@1234",
                email_verification_code: "123456789",
            }
        })

        userRepository = new UserRepositoryImpl(prisma)
    })

    afterEach(async () => {   
        await prisma.user.deleteMany()
    })

   
    test("create user success", async () => {

        const userDto = {

            first_name: 'fahmi',
            last_name: "hidayah",
            email: "fahmi@gmail.com",
            password: "Test@1234"
        }


        const newUser = await userRepository?.create(userDto)
        expect(newUser?.user.first_name).equal("fahmi")
    })

    test('find all users success', async () => {


        const result = await userRepository?.findAll(new BaseQuery());

        expect(result.length).equal(1)
    })

    test('find user by id', async () => {
        const result = await userRepository?.findById(user.id)

        expect(result?.user?.email).equal(user.email)
    })

    test('find user by email', async () => {

        const result = await userRepository?.findByEmail(user.email)

        expect(result?.user?.email).equal(user.email)
    })

    test('update all user fields by id success', async () => {
        
        const result = await userRepository.update(user.id, {
            first_name: 'test',
            last_name: "test",
            email: "test@testmail.com",
            password: "Test123!"
        })

        expect(result?.user?.email).equal('test@testmail.com')
    })

    test('update single user fields by id success', async () => {
      
        const result = await userRepository.update(user?.id!!, {
            first_name: null,
            last_name: null,
            email: "abc@testmail.com",
            password: null
        })

        expect(result?.user?.first_name).equal(user.first_name)
    })

    test('findByVerifyCode failure', async () => {
       
        const result = await userRepository.findByVerifyCode("987323232")

        expect(result).equal(null)
    })

    test('findByVerifyVode success', async () => {
       
        const result = await userRepository.findByVerifyCode("123456789")

        expect(result?.user?.id).equal(user.id)
    })

})