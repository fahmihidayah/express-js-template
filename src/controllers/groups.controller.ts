import * as express from "express";
import { id, inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { TYPE_SERVICE } from "../services";
import { GroupService } from "../services/group.service";
import { GroupWithAuthPermission, GroupWithUser } from "../dtos/group";

@controller("/groups")
export class RoleController extends BaseHttpController {
    constructor(@inject(TYPE_SERVICE.GroupService) private _groupService: GroupService) {
        super()
    }

    @httpPost("/:groupId/user/:userId")
    public async addUser() {
        const params = this.httpContext.request.params;
        const groupId = params.groupId ?? ""
        const userId = params.userId ?? ""
        console.log(userId)
        return this.json({
            message : "Success add user to group",
            status : 200,
            data : await this._groupService.addUser(Number(groupId), Number(userId))
        })
    }

    @httpDelete("/:groupId/user/:userId")
    public async deleteUser() {
        const params = this.httpContext.request.params;
        const groupId = params.groupId ?? ""
        const userId = params.userId ?? ""
        return this.json({
            message : "Success delete user from group",
            status : 200,
            data : await this._groupService.removeUser(Number(groupId), Number(userId))
        })
    }

    @httpPost("/:groupId/auth_permission/:authPermissionId")
    public async addAuthPermission() {
        const params = this.httpContext.request.params;
        const groupId = params.groupId ?? ""
        const authPermissionId = params.authPermissionId ?? ""
        return this.json({
            message : "Success add auth permission to group",
            status : 200,
            data : await this._groupService.addAuthPermission(Number(groupId), Number(authPermissionId))
        })
    }

    @httpDelete("/:groupId/auth_permission/:authPermissionId")
    public async deleteAuthPermission() {
        const query = this.httpContext.request.query;
        const groupId = query.groupId ?? ""
        const authPermissionId = query.authPermissionId ?? ""
        return this.json({
            message : "Success delete auth permission from group",
            status : 200,
            data : await this._groupService.removeAuthPermission(Number(groupId), Number(authPermissionId))
        })
    }

    @httpGet("/")
    public async index() {
        const query = this.httpContext.request.query
        const { page, take } = query
        const keyword : string = query.keyword as string
        return this.json({
            message: "Success load group",
            status: 200,
            data: await this._groupService.findAll({ page: Number(page??"1"), take: Number(take??"5"), keyword: keyword ?? "" })
        })
    }

    @httpPost("/")
    public async create() {
        const groupDto = this.httpContext.request.body;

        const role = await this._groupService.create(groupDto)
        return this.json({
            message: "Success created group",
            status: 200,
            data: role
        })
    }

    @httpGet("/:id")
    public async getRole() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success retrieve group",
            status: 200,
            data: await this._groupService.findById(Number(id))
        })
    }

    @httpDelete("/:id")
    public async deleteRole() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success delete group",
            status: 200,
            data: await this._groupService.delete(Number(id))
        })
    }
}