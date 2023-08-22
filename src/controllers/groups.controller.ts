import 'reflect-metadata';
import * as express from "express";
import { id, inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { GroupService, GroupServiceImpl } from "../services/group.service";
import { GroupWithAuthPermission, GroupWithUser } from "../dtos/group";
import { TYPE_MIDDLWARE_VALIDATION } from "../modules/validation.middleware.module";

@controller("/groups")
export class RoleController extends BaseHttpController {
    private _groupService: GroupService
    constructor(
        groupService: GroupServiceImpl) {
        super()
        this._groupService = groupService
    }

    @httpPost("/:groupId/add_user", TYPE_MIDDLWARE_VALIDATION.GroupWithUserValidationMiddleware)
    public async addUser() {
        const params = this.httpContext.request.params;
        const body: GroupWithUser = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        return this.json({
            message: "Success add user to group",
            status: 200,
            data: await this._groupService.addUser(Number(groupId), Number(body.user_id))
        })
    }

    @httpPost("/:groupId/remove_user", TYPE_MIDDLWARE_VALIDATION.GroupWithUserValidationMiddleware)
    public async deleteUser() {
        const params = this.httpContext.request.params;
        const body: GroupWithUser = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        return this.json({
            message: "Success delete user from group",
            status: 200,
            data: await this._groupService.removeUser(Number(groupId), Number(body.user_id))
        })
    }

    @httpPost("/:groupId/add_auth_permission", TYPE_MIDDLWARE_VALIDATION.GroupWithAuthPermissionValidationMiddleware)
    public async addAuthPermission() {
        const params = this.httpContext.request.params;
        const body: GroupWithAuthPermission = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        return this.json({
            message: "Success add auth permission to group",
            status: 200,
            data: await this._groupService.addAuthPermission(Number(groupId), Number(body.auth_permission_id))
        })
    }

    @httpPost("/:groupId/remove_auth_permission", TYPE_MIDDLWARE_VALIDATION.GroupWithAuthPermissionValidationMiddleware)
    public async deleteAuthPermission() {
        const params = this.httpContext.request.params;
        const body: GroupWithAuthPermission = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        console.log(body)
        return this.json({
            message: "Success delete auth permission from group",
            status: 200,
            data: await this._groupService.removeAuthPermission(Number(groupId), Number(body.auth_permission_id))
        })
    }

    @httpGet("/")
    public async index() {
        const query = this.httpContext.request.query
        const page = Number(query.page ?? "1")
        const take = Number(query.take ?? "5")
        const orderBy = ( query.order_by ?? "id") as string
        const orderByDirection = (query.order_type ?? "asc") as "asc" | "desc"
        const keyword = (query.keyword??"") as string
        const result = await this._groupService.findAllPaginate({page, take, keyword, orderBy, orderByDirection})
        return this.json({
            message: "Success load group",
            status: 200,
            ... result
        })
    }

    @httpPost("/", TYPE_MIDDLWARE_VALIDATION.GroupValidationMiddleware)
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
    public async get() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success retrieve group",
            status: 200,
            data: await this._groupService.findById(Number(id))
        })
    }

    @httpDelete("/:id")
    public async delete() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success delete group",
            status: 200,
            data: await this._groupService.delete(Number(id))
        })
    }
}