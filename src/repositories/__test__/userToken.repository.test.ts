import "reflect-metadata";
import { User, UserToken } from "@prisma/client"
import { prismaMock } from "../../../prisma/singleton"
import { UserTokenRepository, UserTokenRepositoryImpl } from "../userToken.repository"


const prisma = jestPrisma.client

describe('User Token Repository', () => {
    let user : User

    let userTokenRepository : UserTokenRepository

    let token : UserToken

    beforeEach(async () => {
        user = await prisma.user.create({
            data : {
                first_name : "fahmi",
                last_name : "hidayah",
                email : "fahmi@token.com",
                password : "Test@1234",
                email_verification_code : "123456789"
            }
        })

        userTokenRepository = new UserTokenRepositoryImpl(prisma)
        token = await prisma.userToken.create({
            data : {
                user_id : user.id,
                token : "123456789"
            },
        })

    })

    afterEach(async () => {
        await prisma.userToken.deleteMany()
        await prisma.user.deleteMany()
    })

    test('create token success', async () => {
        const newUser = await prisma.user.create({
            data : {
                first_name : "fahmi",
                last_name : "hidayah",
                email : "fahmi@testtoken.com",
                password : "Test@1234",
                email_verification_code : "123456789"
            }})
        const userToken = await userTokenRepository.createToken(newUser, "111111111")
        expect(userToken?.token).toEqual("111111111")
    })

    test('find by token success', async () => {
        const userToken = await userTokenRepository.findByToken("123456789");
        expect(userToken?.token).toEqual("123456789")
    })

    test('find by user success', async () => {
        const userToken = await userTokenRepository.findByUser(user);
        expect(userToken?.token).toEqual("123456789")
    })

    test('update token success', async () => {
        const userToken = await userTokenRepository.updateToken(user, "111111111");
        expect(userToken?.token).toEqual("111111111")
    });
})