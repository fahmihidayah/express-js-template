import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interfaces';
import { SECRET_KEY } from '../config';
import { HttpException } from '../exceptions/httpException';
import { BaseMiddleware } from 'inversify-express-utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { inject, injectable } from 'inversify';
import prisma from '../../prisma/index';
import { TYPE_SERVICE } from '../services';
import { UserService } from '../services/user.service';
// import { SECRET_KEY } from '@config';
// import { HttpException } from '@exceptions/httpException';
// import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const getAuthorization = (req: Request): string | null => {
    const coockie = req.cookies['Authorization'];
    if (coockie) return coockie;

    const header = req.header('Authorization');
    if (header) return header.split('Bearer ')[1];

    return null;
}

@injectable()
export class AuthMiddleware extends BaseMiddleware {

    constructor(@inject(TYPE_SERVICE.UserService) private _userService : UserService) {
        super()
    }

    async handler(req: RequestWithUser,
        res: Response<any, Record<string, any>>,
        next: NextFunction): Promise<void> {
        try {
            const auth = getAuthorization(req);

            if (auth) {
                const { id } = (await verify(auth, SECRET_KEY ?? "test-1234")) as JwtPayload;

                const findUser = await this._userService.findById(id) as User //users.findUnique({ where: { id: Number(id) } });

                if (findUser) {
                    req.user = findUser;
                    next();
                } else {
                    next(new HttpException(401, 'Wrong authentication token'));
                }
            } else {
                next(new HttpException(404, 'Authentication token missing'));
            }
        } catch (error) {
            next(new HttpException(401, 'Wrong authentication token'));
        }
    }

}
