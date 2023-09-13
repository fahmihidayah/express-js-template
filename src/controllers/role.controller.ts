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
import { RoleService, RoleServiceImpl } from "../services/role.service";
import { GroupWithAuthPermission, RoleWithUser } from "../dtos/role";
import { BaseAppController } from './app.controller';

@controller("/groups")
export class RoleController extends BaseAppController {
    private _roleService: RoleService
    constructor(
        RoleService: RoleServiceImpl) {
        super()
        this._roleService = RoleService
    }

    @httpPost("/:groupId/add_user")
    public async addUser() {
        const params = this.httpContext.request.params;
        const body: RoleWithUser = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        return this.json({
            message: "Success add user to group",
            status: 200,
            data: await this._roleService.addUser(Number(groupId), Number(body.user_id))
        })
    }

    @httpPost("/:groupId/remove_user")
    public async deleteUser() {
        const params = this.httpContext.request.params;
        const body: RoleWithUser = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        return this.json({
            message: "Success delete user from group",
            status: 200,
            data: await this._roleService.removeUser(Number(groupId), Number(body.user_id))
        })
    }

    @httpPost("/:groupId/add_auth_permission")
    public async addAuthPermission() {
        const params = this.httpContext.request.params;
        const body: GroupWithAuthPermission = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        return this.json({
            message: "Success add auth permission to group",
            status: 200,
            data: await this._roleService.addAuthPermission(Number(groupId), Number(body.auth_permission_id))
        })
    }

    @httpPost("/:groupId/remove_auth_permission")
    public async deleteAuthPermission() {
        const params = this.httpContext.request.params;
        const body: GroupWithAuthPermission = this.httpContext.request.body;
        const groupId = params.groupId ?? ""
        console.log(body)
        return this.json({
            message: "Success delete auth permission from group",
            status: 200,
            data: await this._roleService.removeAuthPermission(Number(groupId), Number(body.auth_permission_id))
        })
    }

    @httpGet("/")
    public async index() {
        const result = await this._roleService.findAllPaginate(this.getQuery())
        return this.json({
            message: "Success load group",
            status: 200,
            ... result
        })
    }

    @httpPost("/")
    public async create() {
        const groupDto = this.httpContext.request.body;

        const role = await this._roleService.create(groupDto)
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
            data: await this._roleService.findById(Number(id))
        })
    }

    @httpDelete("/:id")
    public async delete() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success delete group",
            status: 200,
            data: await this._roleService.delete(Number(id))
        })
    }
}