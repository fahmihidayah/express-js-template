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
import { TYPE_MIDDLEWARE } from "../middlewares";

@controller("/posts", TYPE_MIDDLEWARE.ErrorMiddleware)
export class PostController extends BaseHttpController {
    
    @httpGet("/", TYPE_MIDDLEWARE.AuthMiddleware)
    public async index() {
        return this.json({
            message : "protected post"
        })
    }

}