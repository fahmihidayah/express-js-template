import 'reflect-metadata';
import * as express from "express";
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { UserService, UserServiceImpl } from "../services/user.service";
import { RequestWithUser } from "../interfaces/auth.interfaces";
import { LoginUserValidationMiddleware, CreateUserValidationMiddleware, RefreshTokenValidationMiddleware } from '../validations/user';
import { TYPE_MIDDLEWARE } from '../middlewares';
import { BaseAppController } from './app.controller';


@controller("/users")
export class UserController extends BaseAppController {   
    private _userService : UserService
    constructor(
        userService : UserServiceImpl
    ) {
        super()
        this._userService = userService
    }

    @httpGet("/")
    public async index() {
        
        const result = await this._userService.findAllPaginate(this.getQuery())
        return this.json({
            message: "Success load users",
            status: 200,
            ... result
        })
    }

    @httpGet("/verify/:code")
    public async verifiedUser() { 
        const verifyCode = this.httpContext.request.params.code;

        const user = await this._userService.verify(verifyCode);
        if(user) {
            return this.json({
                message : "User verified",
                code : 200,
                error : false,
                data : user
            })
        }
        else {
            return this.json({
                message : "User not found",
                code : 400,
                error : false,
                data : user}, 400)
        }
    }

    @httpGet("/:id", TYPE_MIDDLEWARE.AuthMiddleware)
    public async userDetail(@request() request : express.Request) {
        const user = await this._userService.findById(Number(request.params.id));
        return this.json({
            message : "User loaded",
            code : 200, 
            error : false,
            data : user
        })
    }

    @httpPost("/login", LoginUserValidationMiddleware)
    public async login (@request() request : express.Request) {
        const userDto = {... request.body}
        console.log(userDto)
        const userToken = await this._userService.login(userDto)
        return this.json({
            message : "Login Success",
            code : 200,
            error : false,
            data : userToken
        })
    }

    @httpPost("/logout", TYPE_MIDDLEWARE.AuthMiddleware)
    public async logout(@request() request : RequestWithUser) {
        const result = await this._userService.logout(request.userData)
        if(result) {
            return this.json({
                message : "Logout Success",
                code : 200,
                error : false,
                data : null
            })
        }
        else {
            return this.json({
                message : "Logout Failed",
                code : 500,
                error : true,
                data : null
            }, 500)
        }
    }

    @httpPost("/refreshToken", RefreshTokenValidationMiddleware)
    public async refreshToken() {
        const refreshToken = {... this.httpContext.request.body}
        const token = await this._userService.refreshToken(refreshToken)
        if(token !== null) {
            return this.json({
                message : "Token refresh",
                code : 200,
                error : false,
                data : {
                    token : token
                }
            })
        }
        else {
            return this.json({
                message : "Token invalid",
                code : 400,
                error : true
            }, 400)
        }
        
    }

    @httpPost("/register/admin", CreateUserValidationMiddleware)
    public async registerAdmin(@request() request : express.Request) {
        const userDto = {... request.body, is_admin : true}
        const user = await this._userService.register(userDto)
        return this.json({
            message : "Register Success",
            code : 200,
            error : false,
            data : user
        })
    }

    @httpPost("/register", CreateUserValidationMiddleware)
    public async register(@request() request : express.Request) {
        const userDto = {... request.body}
        const user = await this._userService.register(userDto)
        return this.json({
            message : "Register Success",
            code : 200,
            error : false,
            data : user
        })
    }

    @httpGet("/profile", TYPE_MIDDLEWARE.AuthMiddleware) 
    public async getProfile(@request() request : RequestWithUser) {
       
        return this.json({
            message : "Get Profile Success",
            code : 200,
            error : false,
            data : request.userData.toUserNoPassword()
        })
    }

}