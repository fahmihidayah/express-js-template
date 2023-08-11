
import { inject } from "inversify";
import * as express from "express";
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { TYPE_SERVICE } from "../services";
import { GroupService } from "../services/group.service";
import { RequestWithUser } from "../interfaces/auth.interfaces";
import { TYPE_MIDDLEWARE } from "../middlewares";
import { AuthPermission } from "@prisma/client";
import { AuthPermissionService } from "../services/authPermission.service";

@controller("/tasks")
export class TaskController extends BaseHttpController {

    constructor(
        @inject(TYPE_SERVICE.GroupService) private _groupService : GroupService,
        @inject(TYPE_SERVICE.AuthPermissionService) private _authPermissionService : AuthPermissionService
    ) {
        super()
    }

    @httpGet("/edit/:id", TYPE_MIDDLEWARE.AuthMiddleware) 
    public async edit(@request() request : RequestWithUser) {
        const user = request.user;
        const isAllow = await this._authPermissionService.isUserHasPermissionCodeName(user, ["task_create", "task_read"])
        console.log(isAllow)
        if(isAllow) {
            return this.json({
                message : "Response success",
                status : 200,
                error : false,
                data : {
                    message : "has permission task_create and task_read"
                }
            })
        }
        else {
            return this.json({
                message : "Response failure",
                status : 400,
                error : false,
                data : {
                    message : "has no permission task_create and task_read"
                }
            }, 400)
        }
    }

    @httpGet("/:id", TYPE_MIDDLEWARE.AuthMiddleware) 
    public async get(@request() request : RequestWithUser) {
        const user = request.user;
        const isAllow = await this._authPermissionService.isUserHasPermissionName(user, ["task"])
        console.log(isAllow)
        if(isAllow) {
            return this.json({
                message : "Response success",
                status : 200,
                error : false,
                data : {
                    message : "has permission task"
                }
            })
        }
        else {
            return this.json({
                message : "Response failure",
                status : 400,
                error : false,
                data : {
                    message : "has no permission task"
                }
            }, 400)
        }
    }

    @httpGet("/", TYPE_MIDDLEWARE.AuthMiddleware)
    public async index(@request() request : RequestWithUser) {
        const user = request.user

        const isAllow = await this._groupService.isUserInGroupName(user, "admin")

        if(isAllow) {
            return this.json({
                message : "Response success",
                status : 200,
                error : false,
                data : {
                    message : "in group admin"
                }
            })
        }
        else {
            return this.json({
                message : "Response failure",
                status : 400,
                error : false,
                data : {
                    message : "not in group admin"
                }
            }, 400)
        }
    }

}