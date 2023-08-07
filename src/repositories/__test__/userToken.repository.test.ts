import "reflect-metadata";
import { User, UserToken } from "@prisma/client"
import { prismaMock } from "../../../prisma/singleton"
import { UserTokenRepository, UserTokenRepositoryImpl } from "../userToken.repository"


function getSampleUser(): User {
    return {
        id: 1,
        first_name: 'fahmi',
        last_name : "hidayah",
        email: 'fahmi@gmail.com',
        is_email_verified : false,
        is_admin : false,
        email_verification_code : `123456789`,
        password: "Test@1234",
        created_at: new Date(),
        updated_at: new Date(),
    }
}
function getUserToken() : UserToken {
    return {
        id : 1,
        user_id : 1,
        token : "123456789",
        created_at : new Date(),
        updated_at : new Date(),
    }
}

function createUserTokenRepository(): UserTokenRepository {
    return new UserTokenRepositoryImpl(prismaMock)
}

describe('User Token Repository', () => {
    let userTokenRepository : UserTokenRepository = createUserTokenRepository();
    
    test('craete user token success', async () => {
        prismaMock.userToken.create.mockResolvedValue(getUserToken());
        const result = await userTokenRepository.createToken(getSampleUser(), "123456789");
        expect(result).not.toBeNull();
    });

    test('findUserToken By token success', async () =>{

        prismaMock.userToken.findFirst.mockResolvedValue(getUserToken());

        const result = await userTokenRepository.findByToken("123456789");

        expect(result).not.toBeNull();

    } )
})