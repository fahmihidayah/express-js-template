import { User } from '@prisma/client';
import { Request } from 'express';
import { UserData } from '../dtos/user';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  access_token: string;
  refresh_token : string;
  expire_in: number;
}

export interface RequestWithUser extends Request {
  userData: UserData;
}
