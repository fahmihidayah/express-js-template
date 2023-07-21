import { User } from '.prisma/client'
import { CreateUserDto, LoginUserDto } from '../dtos/user'
import { app as expressApplication } from '../index'
import supertest from 'supertest'
import { prismaMock } from '../prisma/singleton'
import { hash } from 'bcrypt'
import { UserService, UserServiceImpl } from '../services/user.service'
import { UserRepositoryImpl } from '../prisma/repositories/user.repository'


async function getSampleUser(): Promise<User> {
    return {
        id: 1,
        name: 'fahmi',
        email: 'fahmi@gmail.com',
        password: await hash("Test@1234", 10),
        created_at: new Date(),
        updated_at: new Date(),
    }
}


describe('User API test', () => {

    const userService : UserService = new UserServiceImpl(new UserRepositoryImpl(prismaMock));

    let token : string = ""

    beforeAll(async () => {
        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())
       
    })

    test('POST /api/v1/users/login success', async () => {
        const loginUserDto: LoginUserDto = {
            email: 'fahmi@gmail.com',
            password: 'Test@1234',
        };

        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())

        return supertest(expressApplication).post('/api/v1/users/login').send(loginUserDto).expect(200)
    })

    test('POST /api/v1/users/register success', async () => {
        const createUserDto: CreateUserDto = {
            name : "fahmi",
            email: 'fahmi@gmail.com',
            password: 'Test@1234',
        };

        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())

        return supertest(expressApplication).post('/api/v1/users/register').send(createUserDto).expect(200)
    })

    test('GET /api/v1/users/profile success', async () => {

        prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())

        const userWithToken = await userService.login({
            email : "fahmi@gmail.com",
            password : "Test@1234"
        })

        token = userWithToken.access_token

        return supertest(expressApplication).get('/api/v1/users/profile').set("Authorization", "Bearer " + token).expect(200)
    })

})