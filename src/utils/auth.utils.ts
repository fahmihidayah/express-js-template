import { User } from "@prisma/client";
import { UserData, UserWithToken } from "../dtos/user";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interfaces";
import { REFRESH_SECRET_KEY, SECRET_KEY } from "../config";
import { sign } from "jsonwebtoken";


export const userToUserData = (e : User) : UserData => {
    return {id: e.id,
        first_name: e.first_name,
        last_name : e.last_name,
        email: e.email,
        is_email_verified : e.is_email_verified,
        created_at: e.created_at,
        updated_at: e.updated_at}
}

export function userToUserWithToken(user : UserData, tokenData : TokenData) : UserWithToken {
    return {
        first_name: user.first_name,
        last_name : user.last_name,
        email: user.email,
        ... tokenData
    }
}

export function createToken(user:User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string | undefined = SECRET_KEY;
    const refreshKey: string | undefined = REFRESH_SECRET_KEY;
    const expires_in: number = 60 * 60;

    return { expire_in : expires_in, 
        access_token: sign(dataStoredInToken, secretKey ?? "test-1234", { expiresIn : "14m" }),
        refresh_token : sign(dataStoredInToken, refreshKey ?? "refresh-1234", { expiresIn : "30d" }  )
    };
}
