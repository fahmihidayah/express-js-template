import { User } from "@prisma/client";
import { UserData, UserWithToken } from "../dtos/user";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interfaces";
import { SECRET_KEY } from "../config";
import { sign } from "jsonwebtoken";


export const userToUserData = (e : User) : UserData => {
    return {id: e.id,
        first_name: e.first_name,
        last_name : e.last_name,
        email: e.email,
        created_at: e.created_at,
        updated_at: e.updated_at}
}

export function userToUserWithToken(user : UserData, tokenData : TokenData) : UserWithToken {
    return {
        first_name: user.first_name,
        last_name : user.last_name,
        email: user.email,
        access_token: tokenData.token,
        refresh_token: "",
        expire_in: tokenData.expiresIn
    }
}

export function createToken(user:User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string | undefined = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey ?? "test-1234", { expiresIn }) };
}