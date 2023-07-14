import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { logger } from '../utils/logger';
import { BaseMiddleware } from 'inversify-express-utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { injectable } from 'inversify';

export const ErrorFunctionMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

@injectable()
export class ErrorMiddleware extends BaseMiddleware {
  handler(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction): void {
    try {
      console.log(`request ${req}`)
      // const status: number = error.status || 500;
      // const message: string = error.message || 'Something went wrong';
  
      // logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      // res.status(status).json({ message });
    } catch (error) {
      next(error);
    }
  }

}

