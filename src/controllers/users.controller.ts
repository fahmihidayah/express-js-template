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
import { CreateUserDto, UserData } from "../dtos/user";
import { TYPE_MIDDLWARE_VALIDATION } from "../modules/validation.middleware.module";
import { ValidationMiddleware } from "../middlewares/validation";
import { TYPE_MIDDLEWARE } from "../middlewares";
import { RequestWithUser } from "../interfaces/auth.interfaces";
import { PaginateList } from "../dtos";


@controller("/users")
export class UserController extends BaseHttpController {   

    constructor(
        @inject(TYPE_SERVICE.UserService) private _userService : UserService
    ) {
        super()
    }

    @httpGet("/")
    public async index() {
        const query = this.httpContext.request.query
        let page = query.page as string;
        let take = query.take as string;
        let keyword = query.keyword as string;
        const users : PaginateList<UserData[]> = await this._userService.findAll({
            page : Number(page??"1"), 
            take : Number(take??"5"),
            keyword : keyword??""
        })
        return this.json({
            message : "Users Loaded",
            code : 200,
            error : false,
            ... users
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

    @httpPost("/login", TYPE_MIDDLWARE_VALIDATION.LoginValidationMiddleware)
    public async login (@request() request : express.Request) {
        const userDto = {... request.body}
        const userToken = await this._userService.login(userDto)
        return this.json({
            message : "Login Success",
            code : 200,
            error : false,
            data : userToken
        })
    }

    @httpPost("/refreshToken", TYPE_MIDDLWARE_VALIDATION.RefreshTokenValidationMiddleware)
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

    @httpPost("/register/admin", TYPE_MIDDLWARE_VALIDATION.RegisterValidationMiddleware )
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

    @httpPost("/register", TYPE_MIDDLWARE_VALIDATION.RegisterValidationMiddleware )
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
        const user = {
            id : request.user.id,
            first_name : request.user.first_name,
            last_name : request.user.last_name,
            email : request.user.email,
            created_at : request.user.created_at,
            updated_at : request.user.updated_at
        }

        return this.json({
            message : "Get Profile Success",
            code : 200,
            error : false,
            data : user
        })
    }

}