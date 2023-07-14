import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../../exceptions/httpException';
import { BaseMiddleware } from 'inversify-express-utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */


export class ValidationMiddleware extends BaseMiddleware {

  private _type : any
  private _skipMissingProperties : boolean
  private _whitelist : boolean
  private _forbidNonWhitelisted : boolean


  constructor(type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) {
    super()
    this._type = type
    this._skipMissingProperties = skipMissingProperties
    this._whitelist = whitelist
    this._forbidNonWhitelisted = forbidNonWhitelisted
    
  }

  handler(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction): void {
    const dto = plainToInstance(this._type, req.body);
    
    validateOrReject(dto, { })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints??"Error unknown")).join(', ');
        next(new HttpException(400, message));
      });
  }
  
}