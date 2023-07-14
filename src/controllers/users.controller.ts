import * as express from "express";
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { TYPE_SERVICE } from "../services";
import { UserService } from "../services/user.service";
import { SECRET_KEY } from "../config";
import { CreateUserDto } from "../dtos/user";
import { TYPE_MIDDLWARE_VALIDATION } from "../modules/validation.middleware.module";
import { ValidationMiddleware } from "../middlewares/validation";


@controller("/users")
export class UserController extends BaseHttpController {   

    constructor(
        @inject(TYPE_SERVICE.UserService) private _userService : UserService
    ) {
        super()
    }

    @httpGet("/")
    public async index() {
        return await this._userService.findAll();
    }

    @httpPost("/login", TYPE_MIDDLWARE_VALIDATION.LoginValidationMiddleware)
    public async login (@request() request : express.Request) {
        const userDto = {... request.body}
        console.log(userDto)
        return this.json({
            message : "Success Login",
            code : 200,
            error : false
        })
    }

    @httpPost("/register", TYPE_MIDDLWARE_VALIDATION.RegisterValidationMiddleware )
    public async register(@request() request : express.Request) {
        const userDto = {... request.body}
        console.log(userDto)
        return this.json({
            message : "Register Success",
            code : 200,
            error : false 
        })
    }

}