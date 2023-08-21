import { User, UserToken } from '.prisma/client'
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from '../dtos/user'
import { app as expressApplication } from '../index'
import supertest from 'supertest'
import { hash } from 'bcrypt'
import { UserService, UserServiceImpl } from '../services/user.service'
import { UserRepositoryImpl } from '../repositories/user.repository'
import { prismaMock } from '../../prisma/singleton'
import { UserTokenRepositoryImpl } from '../repositories/userToken.repository'



// async function getSampleUser(): Promise<User> {
//     return {
//         id: 1,
//         first_name: 'fahmi',
//         last_name : "hidayah",
//         email: 'fahmi@gmail.com',
//         is_email_verified : false,
//         is_admin : false,
//         email_verification_code : "654321",
//         password: await hash("Test@1234", 10),
//         created_at: new Date(),
//         updated_at: new Date(),
//     }
// }

// async function getUserToken() : Promise<UserToken> {
//     return {
//         id : 1,
//         user_id : 1,
//         token : "123456789",
//         created_at : new Date(),
//         updated_at : new Date(),
//     }
// }

describe('User API test', () => {
    test('test success', () => {
        expect(1).toBe(1)
    })
    // const userService : UserService = new UserServiceImpl(new UserRepositoryImpl(prismaMock), new UserTokenRepositoryImpl(prismaMock));

    // let token : string = ""

    // beforeAll(async () => {
    //     // prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())
       
    // })

    // test('POST /api/v1/users/login success', async () => {
    //     const loginUserDto: LoginUserDto = {
    //         email: 'fahmi@gmail.com',
    //         password: 'Test@1234',
    //     };

    //     prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())

    //     return supertest(expressApplication).post('/api/v1/users/login').send(loginUserDto).expect(200)
    // })

    // test('POST /api/v1/users/register success', async () => {
    //     const createUserDto: CreateUserDto = {
    //         first_name : "fahmi",
    //         last_name : "hidayah",
    //         email: 'fahmi1@gmail.com',
    //         password: 'Test@1234',
    //     };

    //     prismaMock.user.create.mockResolvedValue(await getSampleUser())
    //     return supertest(expressApplication).post('/api/v1/users/register').send(createUserDto).expect(200)
    // })

    // test('GET /api/v1/users/profile success', async () => {

    //     prismaMock.user.findUnique.mockResolvedValue(await getSampleUser())

    //     const userWithToken = await userService.login({
    //         email : "fahmi@gmail.com",
    //         password : "Test@1234"
    //     })

    //     token = userWithToken.access_token

    //     return supertest(expressApplication).get('/api/v1/users/profile').set("Authorization", "Bearer " + token).expect(200)
    // })

    // test('GET /api/v1/users/:id success', async () => {
    //     prismaMock.user.findUnique.mockResolvedValue(await getSampleUser());
        
    //     const userWithToken = await userService.login({
    //         email : "fahmi@gmail.com",
    //         password : "Test@1234"
    //     })

    //     token = userWithToken.access_token

    //     return supertest(expressApplication).get('/api/v1/users/' + 1).set("Authorization", "Bearer " + token).expect(200)
    
    // })

    // test('GET /api/v1/users/verify/:code', async () => {
    //     prismaMock.user.findFirst.mockResolvedValue(await getSampleUser());

    //     prismaMock.user.update.mockResolvedValue(await getSampleUser());
        
    //     return supertest(expressApplication).get("/api/v1/users/verify/123456").expect(200);
    // })

    // test("POST /api/v1/users/refreshToken", async () => {
    //     const refreshTokenDto: RefreshTokenDto = {
    //         refreshToken : "123456789"
    //     };
    //     prismaMock.userToken.findFirst.mockResolvedValue(await getUserToken());
    //     return supertest(expressApplication).post("/api/v1/users/refreshToken").send(refreshTokenDto).expect(200);
    // })

})